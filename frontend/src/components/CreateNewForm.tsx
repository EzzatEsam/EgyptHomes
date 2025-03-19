"use client";

import { AddPropertyAction } from "@/app/actions";
import { UseMultiForm } from "@/hooks/useMultiForm";
import { cn, getBase64 } from "@/lib/utils";
import { PropertyCreateRequest } from "@/types/properttCreateRequest";
import { PropertyCategory, PropertyType } from "@/types/propertyPost";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertBox } from "./Alert";

type FormData = PropertyCreateRequest;

// Define the props for each form component
type FormProps = {
  formData: Partial<FormData>;
  handleChange: (data: Partial<FormData>) => void;
  className?: string;
};

const DetailsForm = ({ formData, handleChange }: FormProps) => {
  return (
    <div className="border p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-2">Property Details</h2>
      <div className="flex flex-row justify-between">
        <div className="w-full pr-4">
          <div className="form-control">
            <div className="label">
              <span className="label-text">Title</span>
            </div>
          </div>
          <input
            type="text"
            name="title"
            className="input input-bordered  w-full"
            placeholder="Enter the title of your post"
            value={formData.title}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              handleChange({ title: (e.target as HTMLInputElement).value })
            }
            required
          />
        </div>
        <div>
          <div className="form-control">
            <div className="label">
              <span className="label-text">Category</span>
            </div>
          </div>
          <select
            name="category"
            className="select select-bordered"
            value={formData.category}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              handleChange({
                category:
                  PropertyCategory[
                    (e.target as HTMLSelectElement)
                      .value as keyof typeof PropertyCategory
                  ],
              })
            }
            required
          >
            {Object.values(PropertyCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-control">
        <div className="label">
          <span className="label-text">Description</span>
        </div>
        <textarea
          name="description"
          className="textarea textarea-bordered"
          placeholder="Enter property description"
          value={formData.description}
          onChange={(e: FormEvent<HTMLTextAreaElement>) =>
            handleChange({
              description: (e.target as HTMLTextAreaElement).value,
            })
          }
          required
        />
      </div>
      <div className="flex space-x-4">
        <div className="form-control flex-1">
          <div className="label">
            <span className="label-text">Property Type</span>
          </div>
          <select
            name="propertyType"
            className="select select-bordered"
            value={formData.propertyType}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              handleChange({
                propertyType:
                  PropertyType[
                    (e.target as HTMLSelectElement)
                      .value as keyof typeof PropertyType
                  ],
              })
            }
            required
          >
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
        </div>
        <div className="form-control flex-1">
          <div className="label">
            <span className="label-text">
              Price (EGP){" "}
              {formData.propertyType === PropertyType.Rent ? "/ month" : ""}
            </span>
          </div>
          <input
            type="number"
            name="value"
            min={0}
            className="input input-bordered"
            placeholder="Enter property price in pounds"
            value={formData.price}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              handleChange({
                price: Number((e.target as HTMLInputElement).value),
              })
            }
            required
          />
        </div>
      </div>
    </div>
  );
};

const ImagesForm = ({ className = "" }: FormProps) => {
  return (
    <div className={cn("border p-4 rounded-lg mb-4", className)}>
      <h2 className="text-xl font-semibold mb-2">Upload Images</h2>
      <div className="form-control">
        <div className="label">
          <span className="label-text">Select Images</span>
        </div>
        <input
          type="file"
          name="images"
          className="file-input file-input-bordered w-full "
          accept="image/*"
          multiple
        />
        <span className="text-sm text-gray-500">
          You can select multiple images.
        </span>
      </div>
    </div>
  );
};

const ContactsForm = ({ formData, handleChange }: FormProps) => {
  return (
    <div className="border p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
      <p>
        If not provided, the contact information will be the same as your user
        account.
      </p>
      <div className="flex space-x-4">
        <div className="form-control flex-1">
          <div className="label">
            <span className="label-text">Contact Phone</span>
          </div>
          <input
            type="text"
            name="contactPhone"
            className="input input-bordered"
            placeholder="Enter phone number"
            value={formData.contactPhone}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              handleChange({
                contactPhone: (e.target as HTMLInputElement).value,
              })
            }
          />
        </div>
        <div className="form-control flex-1">
          <div className="label">
            <span className="label-text">Contact Email</span>
          </div>
          <input
            type="email"
            name="contactEmail"
            className="input input-bordered"
            placeholder="Enter email address"
            value={formData.contactEmail}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              handleChange({
                contactEmail: (e.target as HTMLInputElement).value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

const LocationForm = ({ formData, handleChange }: FormProps) => {
  return (
    <div className="border p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-2">Location</h2>
      <div className="form-control">
        <div className="label">
          <span className="label-text">Governorate</span>
        </div>
        <input
          type="text"
          name="country"
          className="input input-bordered"
          placeholder="Enter governorate"
          value={formData.location?.governorate}
          required
          onChange={(e: FormEvent<HTMLInputElement>) => {
            handleChange({
              location: {
                ...formData.location,
                governorate: (e.target as HTMLInputElement).value,
                city: formData.location?.city || "",
                street: formData.location?.street || "",
                latitude: formData.location?.latitude,
                longitude: formData.location?.longitude,
              },
            });
          }}
        />
      </div>
      <div className="form-control">
        <div className="label">
          <span className="label-text">City</span>
        </div>
        <input
          type="text"
          name="city"
          className="input input-bordered"
          placeholder="Enter city"
          value={formData.location?.city}
          required
          onChange={(e: FormEvent<HTMLInputElement>) => {
            handleChange({
              location: {
                ...formData.location,
                city: (e.target as HTMLInputElement).value,
                governorate: formData.location?.governorate || "",
                street: formData.location?.street || "",
                latitude: formData.location?.latitude,
                longitude: formData.location?.longitude,
              },
            });
          }}
        />
      </div>
      <div className="form-control">
        <div className="label">
          <span className="label-text">Street</span>
        </div>
        <input
          type="text"
          name="street"
          className="input input-bordered"
          placeholder="Enter street"
          value={formData.location?.street}
          onChange={(e: FormEvent<HTMLInputElement>) => {
            handleChange({
              location: {
                ...formData.location,
                street: (e.target as HTMLInputElement).value,
                city: formData.location?.city || "",
                governorate: formData.location?.governorate || "",
                latitude: formData.location?.latitude,
                longitude: formData.location?.longitude,
              },
            });
          }}
        />
      </div>
    </div>
  );
};

const AdditionalInfoForm = ({ formData, handleChange }: FormProps) => {
  return (
    <div className="border p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-2">Additional Information</h2>

      <div className="flex space-x-4">
        <div className="form-control flex-1">
          <div className="label">
            <span className="label-text">Number of Bedrooms</span>
          </div>
          <input
            type="number"
            name="numberOfBedrooms"
            className="input input-bordered"
            placeholder="Enter number of bedrooms"
            value={formData.numberOfBedrooms}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              handleChange({
                numberOfBedrooms: Number((e.target as HTMLInputElement).value),
              })
            }
          />
        </div>
        <div className="form-control flex-1">
          <div className="label">
            <span className="label-text">Number of Bathrooms</span>
          </div>
          <input
            type="number"
            name="numberOfBathrooms"
            className="input input-bordered"
            placeholder="Enter number of bathrooms"
            value={formData.numberOfBathrooms}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              handleChange({
                numberOfBathrooms: Number((e.target as HTMLInputElement).value),
              })
            }
          />
        </div>
      </div>
      <div className="form-control">
        <div className="label">
          <span className="label-text">Area (square meters)</span>
        </div>
        <input
          type="number"
          name="area"
          className="input input-bordered"
          placeholder="Enter area in sq meters"
          required
          value={formData.area}
          onChange={(e: FormEvent<HTMLInputElement>) =>
            handleChange({
              area: Number((e.target as HTMLInputElement).value),
            })
          }
        />
      </div>
      <h2 className="my-2">
        <span className="text-xl font-semibold mb-2">Amenities</span>
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="form-control">
          <div className="cursor-pointer label">
            <span className="label-text">Has Garage</span>
            <input
              type="checkbox"
              name="hasGarage"
              className="checkbox"
              onChange={(e: FormEvent<HTMLInputElement>) =>
                handleChange({
                  hasGarage: (e.target as HTMLInputElement).checked,
                })
              }
              checked={formData.hasGarage}
            />
          </div>
        </div>

        <div className="form-control">
          <div className="cursor-pointer label">
            <span className="label-text">Has Air Conditioning</span>
            <input
              type="checkbox"
              name="hasAC"
              className="checkbox"
              onChange={(e: FormEvent<HTMLInputElement>) =>
                handleChange({
                  hasAirConditioning: (e.target as HTMLInputElement).checked,
                })
              }
              checked={formData.hasAirConditioning}
            />
          </div>
        </div>

        <div className="form-control">
          <div className="cursor-pointer label">
            <span className="label-text">Has Garden</span>
            <input
              type="checkbox"
              name="hasGarden"
              className="checkbox"
              onChange={(e: FormEvent<HTMLInputElement>) =>
                handleChange({
                  hasGarden: (e.target as HTMLInputElement).checked,
                })
              }
              checked={formData.hasGarden}
            />
          </div>
        </div>

        <div className="form-control">
          <div className="cursor-pointer label">
            <span className="label-text">Has Swimming Pool</span>
            <input
              type="checkbox"
              name="hasPool"
              className="checkbox"
              onChange={(e: FormEvent<HTMLInputElement>) =>
                handleChange({
                  hasSwimmingPool: (e.target as HTMLInputElement).checked,
                })
              }
              checked={formData.hasSwimmingPool}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function CreateNewForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<FormData>>({
    category: PropertyCategory.House,
    propertyType: PropertyType.Buy,
  });
  const [error, setError] = useState<string | null>(null);
  const handleChange = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
  };
  const { current, currentIdx, next, prev } = UseMultiForm([
    <DetailsForm
      formData={formData}
      handleChange={handleChange}
      key={"detf"}
    />,
    <></>,
    <ContactsForm
      formData={formData}
      handleChange={handleChange}
      key={"conf"}
    />,
    <LocationForm
      formData={formData}
      handleChange={handleChange}
      key={"locf"}
    />,
    <AdditionalInfoForm
      formData={formData}
      handleChange={handleChange}
      key={"addf"}
    />,
  ]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currentIdx < 4) {
      next();
      return;
    }
    const images = (e.target as HTMLFormElement).images.files as FileList;
    const imagesBase64 = await Promise.all(
      Array.from(images).map((image) => getBase64(image))
    );
    const data2Send = {
      ...formData,
      images: imagesBase64,
    };
    console.log("Adding property");
    console.log(formData);
    try {
      const result = await AddPropertyAction(
        data2Send as PropertyCreateRequest
      );
      if (result.success) router.push("/");
      else setError(result.errors![0]);
    } catch (error) {
      // alert("Error creating property");
      console.error("Error creating property", error);
    }
    console.log("Property created");
  };
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Create New Property</h1>
      <form className="p-4 space-y-4 max-w-2xl w-full" onSubmit={onSubmit}>
        {/* Form Steps */}
        <ul className="steps w-full flex justify-center space-x-4">
          <li className={`step step-primary`}>Add details</li>
          <li className={`step ${currentIdx > 0 ? "step-primary" : ""}`}>
            Add images
          </li>
          <li className={`step ${currentIdx > 1 ? "step-primary" : ""}`}>
            Add contacts
          </li>
          <li className={`step ${currentIdx > 2 ? "step-primary" : ""}`}>
            Add location
          </li>
          <li className={`step ${currentIdx > 3 ? "step-primary" : ""}`}>
            Additional info
          </li>
        </ul>
        <ImagesForm
          formData={formData}
          handleChange={handleChange}
          className={`${currentIdx === 1 ? "" : "hidden"}`}
        />
        {current}
        {error && <AlertBox message={error} />}
        <div className="flex justify-between w-full">
          {currentIdx > 0 && (
            <button type="button" onClick={prev} className="btn btn-neutral">
              Previous
            </button>
          )}
          <div className="flex-grow"></div>{" "}
          <button
            className={`btn ${
              currentIdx === 4 ? "btn-primary" : "btn-neutral"
            }`}
          >
            {currentIdx === 4 ? "Submit" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNewForm;
