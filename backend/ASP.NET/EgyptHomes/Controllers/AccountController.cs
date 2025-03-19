using System.Security.Claims;
using System.Security.Cryptography;
using EgyptHomes.Auth;
using EgyptHomes.DTOs;
using EgyptHomes.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EgyptHomes.Controllers;

[ApiController]
[Route("api/auth")]
public class UserAccountController(UserManager<User> userManager, ILogger<UserAccountController> logger, IConfiguration configuration) : ControllerBase
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly ILogger<UserAccountController> _logger = logger;
    private readonly IConfiguration _configuration = configuration;

    [HttpPost]
    [Route("register")]
    public async Task<ActionResult> Register(RegisterDTO register)
    {

        _logger.LogInformation("Register endpoint called with email: {Email}", register.Email);
        var user = new User
        {
            UserName = register.Email,
            Email = register.Email,
            FirstName = register.FirstName,
            LastName = register.LastName,
            PhoneNumber = register.PhoneNumber,


        };

        var result = await _userManager.CreateAsync(user, register.Password);

        if (!result.Succeeded)
        {
            _logger.LogWarning($"User registration failed for email: {register.Email}");
            _logger.LogWarning("User registration failed: {Errors}", result.Errors);

            return BadRequest(result.Errors);
        }

        _logger.LogInformation($"User registered successfully: {register.Email}");
        return NoContent();
    }

    [HttpPost]
    [Route("google-signin")]
    public async Task<ActionResult<LoginTokenDTO>> GoogleSignIn([FromBody] GoogleSignInRequestDTO request)
    {
        _logger.LogInformation("Google Signin endpoint called");

        var IdToken = request.IdToken;

        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = [_configuration["Google:cid"]!],
            ExpirationTimeClockTolerance = TimeSpan.FromMinutes(1)
        };
        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(IdToken, settings);
        }
        catch
        {
            return BadRequest("Invalid token");
        }


        var user = await _userManager.FindByEmailAsync(payload.Email);


        if (user == null)
        {
            user = new User
            {
                UserName = payload.Email,
                Email = payload.Email,
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                EmailConfirmed = payload.EmailVerified,
                Provider = "Google",
                PictureUrl = payload.Picture
            };
            await _userManager.CreateAsync(user);
        }
        else if (user.Provider != "Google")
        {
            return BadRequest("Email already exists with a different provider");
        }

        var expiresInMins = int.Parse(_configuration["JwtAuth:expiresInMins"]!);
        var refreshToken = await GenerateRefreshTokenForUser(user);
        var accessToken = GenerateJwtForUser(user, expiresInMins);
        return new LoginTokenDTO
        {
            AccessToken = accessToken,
            User = user.ToDTO(),
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.Now.AddMinutes(expiresInMins)
        };
    }

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<LoginTokenDTO>> Login(LoginDTO login)
    {
        _logger.LogInformation("Login endpoint called with email: {Email}", login.Email);

        var user = await _userManager.FindByEmailAsync(login.Email);

        if (user == null)
        {
            _logger.LogWarning("User not found with email: {Email}", login.Email);
            return NotFound("User not found");
        }

        if (user.Provider != "EgyptHomes")
        {
            _logger.LogWarning("User signed up with Google, please use Google Signin");
            return BadRequest("User signed up with Google, please use Google Signin");
        }

        var result = await _userManager.CheckPasswordAsync(user, login.Password);

        if (!result)
        {
            _logger.LogWarning("Invalid password for user: {Email}", login.Email);
            return Unauthorized("Invalid password");
        }

        var expiresInMins = int.Parse(_configuration["JwtAuth:expiresInMins"]!);
        var refreshToken = await GenerateRefreshTokenForUser(user);
        var accessToken = GenerateJwtForUser(user, expiresInMins);


        var token = new LoginTokenDTO
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = user.ToDTO(),
            ExpiresAt = DateTime.Now.AddMinutes(expiresInMins)
        };

        _logger.LogInformation("User logged in successfully: {Email}", login.Email);
        return Ok(token);
    }

    [HttpPost("refresh")]
    public ActionResult<LoginTokenDTO> Refresh([FromBody] RefreshRequestDTO refreshRequestDTO)
    {
        _logger.LogInformation("Refresh endpoint called");
        var jwtSecret = _configuration["JwtAuth:secret"]!;
        var accessToken = refreshRequestDTO.AccessToken;
        var refreshToken = refreshRequestDTO.RefreshToken;
        var expiresInMins = int.Parse(_configuration["JwtAuth:expiresInMins"]!);


        var claims = JwtGenerator.GetPrincipal(accessToken, jwtSecret, false);

        if (claims == null)
        {
            _logger.LogWarning("Invalid access token");
            return Unauthorized("Invalid access token");
        }

        var userId = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            _logger.LogWarning("Invalid access token");
            return Unauthorized("Invalid access token");
        }

        var user = _userManager.FindByIdAsync(userId).Result;
        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiry < DateTime.Now)
        {
            _logger.LogWarning("Invalid refresh token");
            return Unauthorized("Invalid refresh token");
        }

        var newAccessToken = JwtGenerator.GenerateJwt(user, jwtSecret, expiresInMins);

        _logger.LogInformation("Token refreshed successfully for user: {UserId}", userId);
        return Ok(new LoginTokenDTO
        {
            AccessToken = newAccessToken,
            RefreshToken = refreshToken,
            User = user.ToDTO(),
            ExpiresAt = DateTime.Now.AddMinutes(expiresInMins)
        });
    }

    [Authorize]
    [HttpDelete("logout")]
    public async Task<ActionResult> Logout()
    {
        _logger.LogInformation("Logout endpoint called");

        var user = await _userManager.GetUserAsync(User);

        if (user == null)
        {
            _logger.LogWarning("User not found during logout");
            return NotFound("User not found");
        }

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;

        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User logged out successfully: {UserName}", user.UserName);
        return NoContent();
    }

    [Authorize]
    [HttpGet]
    [Route("user")]
    public async Task<ActionResult<UserDTO>> Me()
    {
        _logger.LogInformation("Me endpoint called");

        var user = await _userManager.GetUserAsync(User);

        if (user == null)
        {
            _logger.LogWarning("User not found");
            return NotFound("User not found");
        }

        var userDTO = user.ToDTO();

        _logger.LogInformation("User data retrieved successfully: {UserName}", user.UserName);
        return Ok(userDTO);
    }

    private static string GenerateRandomString(int length)
    {
        using (var rng = RandomNumberGenerator.Create())
        {
            var byteArray = new byte[length];
            rng.GetBytes(byteArray);
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var result = new char[length];
            for (int i = 0; i < length; i++)
            {
                result[i] = chars[byteArray[i] % chars.Length];
            }
            return new string(result);
        }
    }


    private string GenerateJwtForUser(User user, int expiresInMins)
    {

        var jwtSecret = _configuration["JwtAuth:secret"]!;

        var accessToken = JwtGenerator.GenerateJwt(user, jwtSecret, expiresInMins);
        return accessToken;
    }

    private async Task<string> GenerateRefreshTokenForUser(User user)
    {
        var refreshTokenExpiresDays = double.Parse(_configuration["JwtAuth:refreshTokenExpiresDays"]!);
        var refreshToken = GenerateRandomString(64);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.Now.AddDays(refreshTokenExpiresDays).ToUniversalTime();

        await _userManager.UpdateAsync(user);
        return refreshToken;

    }
}