"use client";
import React from "react";
import CustomCarousel from "./CustomCarousel";
import {
  IconBxsPhoneCall,
  IconEmail,
  IconWhatsappFill,
  IconLocationOutline,
  IconBedQueenOutline,
  IconToilet,
  IconDimensions,
  IconBxsCarGarage,
} from "./Icons";
import { PropertyPost, PropertyType } from "@/types/propertyPost";
import { FavoriteButton } from "./ContactButtons";
import { getDaysAgo } from "@/lib/utils";

interface PropertyCardProps {
  property: PropertyPost;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Card click handler, navigating to the property page
  const handleCardClick = () => {
    location.href = `/property/${property.id}`;
  };

  return (
    <div
      className="card card-side shadow-xl max-w-xl m-6 border-2 cursor-pointer transition-transform hover:scale-105 hover:shadow-2xl"
      onClick={handleCardClick}
    >
      <div className="flex flex-col w-full rounded-inherit bg-base-200">
        {/* Top Section: Carousel and Property Info */}
        <div className="flex sm:flex-row flex-col border-b-2 mb-2 rounded-inherit bg-base-100">
          {/* Property images carousel */}
          <CustomCarousel
            images={property.images || ["/default-image.jpg"]}
            className="rounded-l-inherit rounded-r-inherit sm:rounded-r-none min-w-80"
          />

          {/* Card Body: Property Details */}
          <div className="card-body p-4 space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {property.category}
            </h2>
            <h2 className="card-title text-2xl font-semibold text-primary">
              {property.price.toLocaleString()} EGP{" "}
              {property.propertyType === PropertyType.Rent ? "/ month" : ""}
            </h2>
            <div className="text-lg font-semibold">{property.title}</div>
            <div className="divider my-2"></div>

            {/* Property Address */}
            <div className="flex items-center text-sm text-gray-600">
              <IconLocationOutline width={28} height={28} className="m-2" />
              <div>
                {property.location?.governorate}, {property.location?.city},{" "}
                {property.location?.street}
              </div>
            </div>

            {/* Property Details (Bedrooms, Bathrooms, Area, Garage) */}
            <div className="flex flex-wrap items-center justify-start space-x-4 text-gray-700 min-w-56">
              <div className="flex items-center">
                <IconDimensions height={24} width={24} />
                <div className="ml-1 font-medium">{property.area} sqm</div>
              </div>

              {property.numberOfBedrooms && (
                <div className="flex items-center">
                  <IconBedQueenOutline height={24} width={24} />
                  <div className="ml-1 font-medium">
                    {property.numberOfBedrooms} Beds
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-start space-x-4 text-gray-700">
              {property.numberOfBathrooms && (
                <div className="flex items-center">
                  <IconToilet height={24} width={24} />
                  <div className="ml-1 font-medium">
                    {property.numberOfBathrooms} Baths
                  </div>
                </div>
              )}

              {property.hasGarage && (
                <div className="flex items-center">
                  <IconBxsCarGarage height={24} width={24} />
                  <div className="ml-1 font-medium">Garage</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="flex flex-row justify-between items-center py-3 px-4 bg-gray-100">
          <div className="text-sm text-gray-500 hidden sm:block">
            {getDaysAgo(property.createdAt)}
          </div>
          <div className="flex space-x-3">
            {property.contactPhone && (
              <a
                className="btn btn-outline btn-primary"
                onClick={(e) => e.stopPropagation()}
                href={"tel:" + property.contactPhone}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBxsPhoneCall height={24} width={24} />
                Call
              </a>
            )}
            <a
              className="btn btn-outline btn-primary"
              onClick={(e) => e.stopPropagation()}
              href={"mailto:" + property.contactEmail}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconEmail height={24} width={24} />
              Email
            </a>
            <a
              className="btn btn-outline btn-primary"
              onClick={(e) => e.stopPropagation()}
              href={"https://wa.me/" + property.contactPhone}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsappFill height={24} width={24} />
              WhatsApp
            </a>
            <FavoriteButton
              pId={property.id}
              dim={24}
              text=""
              isFavourite={property.isFavorited}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
