import React, { useEffect } from "react";
import css from "./Modal.module.css";

export const Modal = ({
  src,
  closeModal,
}: {
  src: string;
  closeModal: () => void;
}) => {
  useEffect(() => {
    const checkKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", checkKey);
    return () => {
      document.removeEventListener("keydown", checkKey);
    };
  }, [closeModal]);

  const checkOverlay = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={css.Overlay} onClick={checkOverlay}>
      <div className={css.Modal}>
        <img src={src} alt="" />
      </div>
    </div>
  );
};
