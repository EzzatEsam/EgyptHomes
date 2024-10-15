"use server";
import { FetchPropertySingle } from "@/app/actions";
import {
  CallButton,
  DeleteButton,
  EmailButton,
  FavoriteButton,
  WhatsAppButton,
} from "@/components/ContactButtons";
import CustomCarousel from "@/components/CustomCarousel";
import ExpandText from "@/components/ExpandableText";
import {
  IconAirConditioner,
  IconBedQueenOutline,
  IconBxsCarGarage,
  IconDimensions,
  IconHome,
  IconLocationOutline,
  IconPool,
  IconSunPlantWilt,
  IconToilet,
} from "@/components/Icons";
import { getAuth } from "@/lib/auth";
import { getDaysAgo } from "@/lib/utils";
import { PropertyType } from "@/types/propertyPost";
import { UserDTO } from "@/types/user";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  console.log(params);
  const id: number = Number(params.id);
  const propertyData = await FetchPropertySingle(id);
  const session = await getAuth();
  const user = session?.user as UserDTO;

  if (!propertyData) {
    return notFound();
  } else {
    return (
      <div className="flex flex-col container mx-auto px-4 mb-8">
        {/* Breadcrumbs */}
        <div className="breadcrumbs my-6">
          <ul className="text-sm text-gray-500">
            <li>
              <a href="/">
                <IconHome className="mr-1" />
              </a>
            </li>
            <li>
              <a
                href={`/search?propertyType=${propertyData.propertyType}&propertyCategory=${propertyData.category}`}
              >
                {propertyData.category}s for{" "}
                {propertyData.propertyType === "Buy" ? "Sale" : "Rent"}
              </a>
            </li>
            {propertyData.location.governorate && (
              <li>
                <a
                  href={`/search?governorate=${propertyData.location.governorate}&propertyType=${propertyData.propertyType}&propertyCategory=${propertyData.category}`}
                >
                  {propertyData.location.governorate}
                </a>
              </li>
            )}
            {propertyData.location.city && (
              <li>
                <a
                  href={`/search?city=${propertyData.location.city}&governorate=${propertyData.location.governorate}&propertyType=${propertyData.propertyType}&propertyCategory=${propertyData.category}`}
                >
                  {propertyData.location.city}
                </a>
              </li>
            )}
            {propertyData.location.street && (
              <li>
                <a
                  href={`/search?street=${propertyData.location.street}&city=${propertyData.location.city}&governorate=${propertyData.location.governorate}&propertyType=${propertyData.propertyType}&propertyCategory=${propertyData.category}`}
                >
                  {propertyData.location.street}
                </a>
              </li>
            )}
            <li>{propertyData.title}</li>
          </ul>
        </div>

        <div className="flex flex-row">
          <div className="flex flex-col min-w-96">
            <h2 className="text-5xl font-semibold ">
              {propertyData.price.toLocaleString()} EGP{" "}
              {propertyData.propertyType === PropertyType.Rent ? "/ month" : ""}
            </h2>
            <div className="grid grid-cols-4 gap-4 my-8 w-full items-center justify-center">
              {propertyData.numberOfBedrooms && (
                <div className="flex flex-col items-center">
                  <IconBedQueenOutline
                    height={24}
                    width={24}
                    className="mb-2"
                  />
                  <div className="text-sm text-center">
                    {propertyData.numberOfBedrooms}
                  </div>
                </div>
              )}

              {propertyData.numberOfBathrooms && (
                <div className="flex flex-col items-center">
                  <IconToilet height={24} width={24} className="mb-2" />
                  <div className="text-sm text-center">
                    {propertyData.numberOfBathrooms}
                  </div>
                </div>
              )}

              {propertyData.area && (
                <div className="flex flex-col items-center">
                  <IconDimensions height={24} width={24} className="mb-2" />
                  <div className="text-sm text-center">
                    {propertyData.area} sqm
                  </div>
                </div>
              )}

              {propertyData.hasGarden && (
                <div className="flex flex-col items-center">
                  <IconSunPlantWilt height={24} width={24} className="mb-2" />
                  <div className="text-sm text-center">Has Garden</div>
                </div>
              )}

              {propertyData.hasSwimmingPool && (
                <div className="flex flex-col items-center">
                  <IconPool height={24} width={24} className="mb-2" />
                  <div className="text-sm text-center">Has Swimming Pool</div>
                </div>
              )}

              {propertyData.hasAirConditioning && (
                <div className="flex flex-col items-center">
                  <IconAirConditioner height={24} width={24} className="mb-2" />
                  <div className="text-sm text-center">
                    Has Air Conditioning
                  </div>
                </div>
              )}

              {propertyData.hasGarage && (
                <div className="flex flex-col items-center">
                  <IconBxsCarGarage height={24} width={24} className="mb-2" />
                  <div className="text-sm text-center">Has Garage</div>
                </div>
              )}

              {/* Dividers between columns */}
              <div className="col-span-4 flex justify-center items-center w-full my-4">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-8  w-full ">
              {user?.id === propertyData.user.id ? (
                <DeleteButton pId={propertyData.id} />
              ) : (
                <>
                  <EmailButton contactEmail={propertyData.contactEmail} />
                  <CallButton contactPhone={propertyData.contactPhone} />
                  <WhatsAppButton contactPhone={propertyData.contactPhone} />
                  <FavoriteButton
                    pId={propertyData.id}
                    isFavourite={propertyData.isFavorited}
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex w-full justify-center items-center">
            <CustomCarousel
              images={propertyData.images!}
              className="max-w-xl rounded-md"
            />
          </div>
        </div>
        <div className="divider"></div>

        <h1 className="text-3xl mb-2">{propertyData.title}</h1>
        <div className="text-2xl flex items-center text-primary">
          <IconLocationOutline className="mr-2 h-6 w-6" /> {/* Icon size */}
          <span>
            {propertyData.location?.city}, {propertyData.location?.governorate},{" "}
            {propertyData.location?.street}
          </span>
        </div>
        <div className="text-lg text-gray-500 hidden sm:block  my-3">
          {getDaysAgo(propertyData.createdAt)}
        </div>

        <ExpandText text={propertyData.description} />

        <div className="divider"></div>

        <div className="text-2xl mb-4">Provided by</div>
        <div className="flex items-center space-x-6">
          <img
            src={
              propertyData.user.pictureUrl ?? "https://via.placeholder.com/100"
            } // Replace this with the actual image URL
            alt="John Doe, Property Agent" // Descriptive alt text
            className="w-24 h-24 rounded-full"
          />
          <a
            href={"/user/" + propertyData.user.id} // Replace this with the actual profile link
            className="text-2xl font-bold hover:underline"
          >
            {propertyData.user.firstName} {propertyData.user.lastName}
          </a>
          <h2>{propertyData.user.phoneNumber}</h2>
          <h2>{propertyData.user.email}</h2>
        </div>
      </div>
    );
  }
}
