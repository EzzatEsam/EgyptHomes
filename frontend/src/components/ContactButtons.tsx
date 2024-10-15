"use client";
import { cn } from "@/lib/utils";
import {
  IconBxsPhoneCall,
  IconCancel,
  IconDelete,
  IconEmail,
  IconHeartFilled,
  IconHeartOutlined,
  IconWhatsappFill,
} from "./Icons";
import {
  AddFavouriteAction,
  DeletePropertyAction,
  RemoveFavouriteAction,
} from "@/app/actions";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  contactEmail?: string;
  contactPhone?: string;
  className?: string;
  dim?: number;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;
}

// EmailButton Component
export const EmailButton: React.FC<ButtonProps> = ({
  contactEmail,
  className,
  dim = 24,
  onClick,
}) => {
  return (
    <a
      className={cn("btn btn-outline", className)}
      href={"mailto:" + contactEmail}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconEmail height={dim} width={dim} /> Email
    </a>
  );
};

// CallButton Component
export const CallButton: React.FC<ButtonProps> = ({
  contactPhone,
  dim = 24,
  className,
  onClick,
}) => {
  return (
    <a
      className={cn("btn btn-outline", className)}
      href={"tel:" + contactPhone}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconBxsPhoneCall height={dim} width={dim} /> Call
    </a>
  );
};

// WhatsAppButton Component
export const WhatsAppButton: React.FC<ButtonProps> = ({
  contactPhone,
  className,
  dim = 24,
  onClick,
}) => {
  return (
    <a
      className={cn("btn btn-outline", className)}
      href={"https://wa.me/" + contactPhone}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconWhatsappFill height={dim} width={dim} /> WhatsApp
    </a>
  );
};

// FavoriteButton Component
export const FavoriteButton = ({
  className,
  pId,
  dim = 24,
  isFavourite = undefined,
  text = "Add to favorites",
}: {
  className?: string;
  pId: number;
  dim?: number;
  text?: string;
  isFavourite?: boolean;
}) => {
  const [fav, setFav] = useState(isFavourite);
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Heart (favorite) button clicked");
    try {
      if (fav === false) {
        AddFavouriteAction(pId);
      } else if (isFavourite === true) {
        RemoveFavouriteAction(pId);
      }

      if (fav !== undefined) {
        setFav(!fav);
      }
    } finally {
    }
  };
  // Add logic for adding to favorites if needed
  return (
    <button
      className={cn("btn btn-outline", className)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {fav === true ? (
        <IconHeartFilled height={dim} width={dim}></IconHeartFilled>
      ) : (
        <IconHeartOutlined height={dim} width={dim} />
      )}
      {text}
    </button>
  );
};

export const DeleteButton = ({
  className,
  pId,
  dim = 24,
}: {
  className?: string;
  pId: number;
  dim?: number;
}) => {
  const router = useRouter();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const onConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete button clicked");
    try {
      console.log("Delete button clicked");
      await DeletePropertyAction(pId);
      router.push("/");
    } finally {
    }
  };
  return (
    <>
      <button
        className={cn("btn btn-outline", className)}
        onClick={(e) => {
          e.stopPropagation();
          dialogRef.current?.showModal();
        }}
      >
        Delete
      </button>
      <dialog id="my_modal_1" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this property?
          </h3>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn mx-2">
                <IconCancel height={dim} width={dim} />
                Cancel
              </button>
              <button className="btn btn-error mx-2" onClick={onConfirmDelete}>
                <IconDelete height={dim} width={dim} /> Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
