import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { defaultScrollbarStyle } from "../../../defaults";
import Tooltip from "../Tooltip";

type ItemProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  heading: React.ReactNode;
  onItemClick(args: T): void;
  search?: React.ReactNode;
  disabled?: boolean;
  width?: number | string;
  height?: string; // Height of the dropdown menu
  tooltipMessage?: string;
  tooltipDirection?: "top" | "bottom" | "left" | "right" | undefined;
  tooltipDelay?: number;
  closeMenuOnSelect?: boolean;
};

export default function DropdownSelect<T>({
  disabled = false,
  heading,
  search,
  items,
  renderItem,
  onItemClick,
  height = "h-32",
  tooltipMessage,
  tooltipDirection = "top",
  tooltipDelay,
  closeMenuOnSelect = true,
}: ItemProps<T>) {
  // State to track whether the dropdown menu is open
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`${
        isMenuOpen ? "relative" : ""
      } inline-block w-full text-left`}
    >
      <Tooltip
        message={tooltipMessage}
        direction={tooltipDirection}
        delay={tooltipDelay}
      >
        <div
          className={`${
            disabled && "cursor-not-allowed text-slate-500 "
          } flex w-full cursor-pointer items-center justify-between gap-4 rounded border border-slate-500 px-2 py-1`}
          onClick={(e) => {
            if (disabled) {
              return;
            }
            setMenuOpen(!isMenuOpen);
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }
            if (e.key === "Enter" || e.key === " ") {
              // Toggle the dropdown on Enter or Space key
              setMenuOpen(!isMenuOpen);
              e.preventDefault();
            }
          }}
          tabIndex={disabled ? -1 : 0} // Make the div focusable unless disabled
          role="button" // Indicate that this div acts as a button
          aria-expanded={isMenuOpen} // Indicate whether the dropdown is open
          aria-haspopup="listbox" // Indicate that it opens a listbox
        >
          <div>{heading}</div>
          <p>
            <FaChevronDown
              className={`${
                isMenuOpen && "-rotate-180"
              } transition duration-500`}
            />
          </p>
        </div>
      </Tooltip>
      {isMenuOpen && (
        <DropdownMenu
          heading={heading}
          setMenuOpen={setMenuOpen}
          renderItem={renderItem}
          items={items}
          onItemClick={onItemClick}
          search={search}
          height={height}
          closeMenuOnSelect={closeMenuOnSelect}
        />
      )}
    </div>
  );
}

type DropdownMenuProps = {
  height: string;
  setMenuOpen: (isOpen: boolean) => void;
};

// Dropdown menu component
const DropdownMenu = <T,>({
  items,
  renderItem,
  onItemClick,
  search,
  height,
  setMenuOpen,
  closeMenuOnSelect,
}: ItemProps<T> & DropdownMenuProps) => {
  const [didMouseEnter, setDidMouseEnter] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // Track the focused item

  // Close the menu if no mouse enters in 5 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!didMouseEnter) {
        setMenuOpen(false);
      }
    }, 5000);
    if (didMouseEnter) {
      clearTimeout(timeoutId);
    }
    return () => clearTimeout(timeoutId);
  }, [didMouseEnter]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      // Move focus to the next item
      setFocusedIndex((prev) =>
        prev === null || prev === items.length - 1 ? 0 : prev + 1
      );
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      // Move focus to the previous item
      setFocusedIndex((prev) =>
        prev === null || prev === 0 ? items.length - 1 : prev - 1
      );
      e.preventDefault();
    } else if (e.key === "Enter" || e.key === " ") {
      // Select the focused item
      if (focusedIndex !== null) {
        onItemClick(items[focusedIndex]);
        if (closeMenuOnSelect) {
          setMenuOpen(false);
        }
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      // Close the menu
      setMenuOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div
      className={`absolute right-0 z-10 mt-1 ${height} w-full origin-top-right items-center gap-y-2 overflow-y-auto overflow-x-hidden rounded-sm border border-slate-500 bg-slate-100 p-2 dark:bg-slate-800 ${defaultScrollbarStyle}`}
      onMouseLeave={() => setMenuOpen(false)}
      onMouseEnter={() => setDidMouseEnter(true)}
      onKeyDown={handleKeyDown} // Handle keyboard navigation
    >
      {search && search}
      <div
        tabIndex={-1} // Make the menu not focusable
        aria-label="Dropdown Menu" // Provide an accessible label
        role="listbox" // Indicate that this is a listbox
      >
        {items.map((item, index) => (
          <div
            key={index}
            aria-label="dropdown-item" // Provide an accessible label for each item
            onClick={(e) => {
              if (closeMenuOnSelect) {
                setMenuOpen(false);
              }
              onItemClick(item);
              e.stopPropagation();
            }}
            tabIndex={0} // Include each item in the natural tab order
            role="option" // Indicate that this is an option in the listbox
            aria-selected={focusedIndex === index} // Indicate if the item is focused
            className={`cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 ${
              focusedIndex === index ? "bg-slate-300 dark:bg-slate-600" : ""
            }`}
            onMouseEnter={() => setFocusedIndex(index)} // Update focus on mouse hover
            onFocus={() => setFocusedIndex(index)} // Update focus when tabbing to the item
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
