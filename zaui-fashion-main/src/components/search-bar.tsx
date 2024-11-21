import { SearchIcon } from "@/components/vectors";
import { forwardRef, HTMLAttributes, HTMLProps } from "react";

const SearchBar = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  (props, ref) => {
    return (
      <div className="px-4">
        <div className="relative w-full">
          <input
            ref={ref}
            className="w-full h-12 pl-12 pr-3 bg-section text-lg rounded-lg outline-none placeholder:text-inactive"
            placeholder="Tìm kiếm khóa học"
            {...props}
          />
          <SearchIcon className="absolute top-3 left-3" />
        </div>
      </div>
    );
  }
);

export default SearchBar;
