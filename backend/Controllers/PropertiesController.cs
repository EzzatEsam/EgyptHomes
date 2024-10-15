
using System.ComponentModel;
using EgyptHomes.DTOs;
using EgyptHomes.Models;
using EgyptHomes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace EgyptHomes.Controllers;
[ApiController]
[Route("api/properties")]
public class PropertiesController(PropertyManagementService propertyManagementService, UserManager<User> userManager,
ImageDbService imageDbService,
ImageIOService imageIOService,
 ILogger<PropertiesController> logger) : ControllerBase
{

    private readonly UserManager<User> _userManager = userManager;
    private readonly ImageDbService _imageDbService = imageDbService;
    private readonly ImageIOService _imageIOService = imageIOService;
    private readonly ILogger<PropertiesController> _logger = logger;
    private readonly PropertyManagementService _propertyManagementService = propertyManagementService;



    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post(PropertyCreateDTO propertyPost)
    {
        var user = await _userManager.GetUserAsync(User);
        Console.WriteLine("Post property endpoint called by user");
        if (user is null)
            return Unauthorized("User not signed in correctly");

        if (!user.EmailConfirmed)
        {
            Console.WriteLine("Email not confirmed. You need to confirm your email before posting a property");
            // return Forbid("Email not confirmed. You need to confirm your email before posting a property");
            return StatusCode(403, "Email not confirmed. You need to confirm your email before posting a property");
        }
        var property = propertyPost.ToModel();
        if (propertyPost.ContactPhone is null)
        {
            property.ContactPhone = user.PhoneNumber;
        }
        if (propertyPost.ContactEmail is null)
        {
            property.ContactEmail = user.Email;
        }
        property.User = user;
        var error = await _propertyManagementService.CreateProperty(property);



        if (error is not null)
        {
            return BadRequest(error.Message);
        }

        var files = propertyPost.Images;
        if (files.Count > 0)
        {
            for (int i = 0; i < files.Count; i++)
            {
                var guid = Guid.NewGuid();
                error = _imageIOService.SaveImage(files[i], guid);

                if (error is not null)
                {
                    await _propertyManagementService.DeleteProperty(property.Id);
                    return BadRequest("Failed to upload image");
                }
                var propertyImage = new PropertyImage()
                {
                    PropertyId = property.Id,
                    Id = guid
                };
                error = await _imageDbService.AddImageToProperty(propertyImage);
                if (error is not null)
                {
                    await _propertyManagementService.DeleteProperty(property.Id);
                    return BadRequest("Failed to upload image");
                }

            }
        }
        return NoContent();
    }


    [HttpGet("user/{id}")]
    public async Task<ActionResult<IEnumerable<PropertyPostDto>>> GetUserProperties([BindRequired] string id, [FromQuery] PaginationRequestDTO requestDTO)
    {

        var user = await _userManager.GetUserAsync(User);

        var result = await _propertyManagementService.GetPropertiesForUser(id,
        pageSize: requestDTO.PageSize,
        page: requestDTO.PageNumber, visitorId: user?.Id);


        return Ok(
            new PaginatedResult<PropertyPostDto>
            {
                Results = result.Results.Select(p => p.ToDTO()).ToList(),
                Page = result.Page,
                PageSize = result.PageSize,
                TotalPages = result.TotalPages,
                TotalResults = result.TotalResults
            }
        );
    }

    [HttpGet("favourites")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<PropertyPostDto>>> GetFavourites([FromQuery] PaginationRequestDTO requestDTO)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
            return Unauthorized("User not signed in correctly");
        var properties = await _propertyManagementService.GetFavourites(user
        , pageSize: requestDTO.PageSize,
        page: requestDTO.PageNumber
        );

        return Ok(
            new PaginatedResult<PropertyPostDto>
            {
                Results = properties.Results.Select(p => p.ToDTO()).ToList(),
                Page = properties.Page,
                PageSize = properties.PageSize,
                TotalPages = properties.TotalPages,
                TotalResults = properties.TotalResults
            }
        );
    }

    [HttpPost("favourites/{id}")]
    [Authorize]
    public async Task<IActionResult> AddFarourite(long id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized("User not signed in correctly");
        }
        var error = await _propertyManagementService.AddFavourite(id, user.Id);
        if (error != null)
        {
            return BadRequest(error.Message);
        }
        return NoContent();
    }

    [HttpDelete("favourites/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteFavourite(long id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized("User not signed in correctly");
        }
        var error = await _propertyManagementService.DeleteFavourite(id, user.Id);
        if (error != null)
        {
            return BadRequest(error.Message);
        }
        return NoContent();
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyPostDto>> Get([BindRequired] long id)
    {
        var userId = (await _userManager.GetUserAsync(User))?.Id;
        _logger.LogInformation("Get property with id: {Id}", id);
        var pr = await _propertyManagementService.GetProperty(id, userId);
        if (pr == null)
        {
            return NotFound("Property not found");
        }

        return Ok(pr.ToDTO());
    }


    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(long id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized("User not signed in correctly");
        }

        var property = await _propertyManagementService.GetProperty(id);

        if (property is not null)
        {
            if (property.UserId == user.Id)
            {
                var error = await _propertyManagementService.DeleteProperty(property.Id);
                if (error is not null)
                {
                    return BadRequest(error.Message);
                }
                return NoContent();
            }
            else
            {
                return Forbid("You are not the owner of this property");
            }
        }
        else
        {
            return NotFound("Property not found");
        }

    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Put(long id, PropertyCreateDTO propertyPost)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
            return Unauthorized("User not signed in correctly");
        var property = await _propertyManagementService.GetProperty(id);

        if (property is null)
        {
            return NotFound("Property not found");
        }
        else if (property.UserId != user.Id)
        {
            return Forbid("You are not the owner of this property");
        }

        var updatedProperty = propertyPost.ToModel();
        updatedProperty.Id = id;
        var error = await _propertyManagementService.UpdateProperty(updatedProperty);
        if (error is not null)
        {
            return BadRequest(error.Message);
        }
        return NoContent();
    }
    [HttpGet("recent")]
    public async Task<ActionResult<PaginatedResult<PropertyPostDto>>> GetRecentProperties([FromQuery] PaginationRequestDTO requestDTO)
    {
        var userId = (await _userManager.GetUserAsync(User))?.Id;
        var properties = await _propertyManagementService.GetRecentProperties(requestDTO.PageSize, requestDTO.PageNumber, userId);


        return Ok(
            new PaginatedResult<PropertyPostDto>
            {
                Results = properties.Results.Select(p => p.ToDTO()).ToList(),
                Page = properties.Page,
                PageSize = properties.PageSize,
                TotalPages = properties.TotalPages,
                TotalResults = properties.TotalResults
            }
        );
    }

    [HttpGet("search")]
    public async Task<ActionResult<PaginatedResult<PropertyPostDto>>> SearchForProperties([FromQuery] PropertySearchDTO search)
    {
        var userId = (await _userManager.GetUserAsync(User))?.Id;
        var result = await _propertyManagementService.Search(search, userId);
        return Ok(
            new PaginatedResult<PropertyPostDto>
            {
                Results = result.Results.Select(p => p.ToDTO()).ToList(),
                Page = result.Page,
                PageSize = result.PageSize,
                TotalPages = result.TotalPages,
                TotalResults = result.TotalResults
            }
        );
    }



}