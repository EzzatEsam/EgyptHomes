"use server";
import { cn } from "@/lib/utils";
import { PropertyCategory, PropertyType } from "@/types/propertyPost";
import { PropertySearchDTO } from "@/types/SearchRequest";

export default async function SearchBar({
  searchParams,
  className,
}: {
  searchParams?: PropertySearchDTO;
  className?: string;
}) {
  return (
    <form
      action={"/search"}
      className={cn(
        "bg-base-100 w-full h-20 border-b-2 flex flex-row items-center p-4 space-x-4 justify-between",
        className
      )}
    >
      <input
        name="governorate"
        type="text"
        placeholder="Governorate"
        className="input input-bordered"
        defaultValue={searchParams?.governorate}
      />
      <input
        name="city"
        type="text"
        placeholder="City"
        defaultValue={searchParams?.city}
        className="input input-bordered "
      />
      <input
        name="street"
        type="text"
        placeholder="Streat"
        defaultValue={searchParams?.street}
        className="input input-bordered "
      />

      <select
        className="select select-bordered"
        name="propertyType"
        defaultValue={searchParams?.propertyType ?? "Buy/Rent"}
      >
        <option value={"Buy"}>{PropertyType.Buy}</option>
        <option value={"Rent"}>{PropertyType.Rent}</option>
      </select>

      <select
        className="select select-bordered"
        name="propertyCategory"
        defaultValue={searchParams?.propertyCategory ?? "Property Type"}
      >
        {Object.values(PropertyCategory).map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      <details className="dropdown dropdown-end">
        <summary className="select items-center select-bordered">Price</summary>
        <ul className=" dropdown-content bg-base-100 rounded-box z-[1] w-72  shadow p-4">
          <li>
            <div className="flex flex-row space-x-2">
              <input
                name="minPrice"
                type="number"
                min={0}
                placeholder="Min price"
                defaultValue={searchParams?.minPrice}
                className="input input-bordered w-1/2"
              />
              <input
                name="maxPrice"
                min={0}
                type="number"
                placeholder="Max price"
                defaultValue={searchParams?.maxPrice}
                className="input input-bordered w-1/2"
              />
            </div>
          </li>
        </ul>
      </details>
      <details className="dropdown dropdown-end">
        <summary className="select items-center select-bordered">
          Amenities
        </summary>
        <ul className=" dropdown-content bg-base-100 rounded-box z-[1] w-72  shadow p-4">
          <li>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Garage</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  name="hasGarage"
                  defaultChecked={searchParams?.hasGarage}
                />
              </label>
            </div>
          </li>
          <li>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Garden</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  name="hasGarden"
                  defaultChecked={searchParams?.hasGarden}
                />
              </label>
            </div>
          </li>
          <li>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Air conditioning</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  name="hasAirConditioning"
                  defaultChecked={searchParams?.hasAirConditioning}
                />
              </label>
            </div>
          </li>
          <li>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Swimming pool</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  name="hasSwimmingPool"
                  defaultChecked={searchParams?.hasSwimmingPool}
                />
              </label>
            </div>
          </li>
        </ul>
      </details>
      <button className="btn btn-primary btn-outline"> Search </button>
    </form>
  );
}
