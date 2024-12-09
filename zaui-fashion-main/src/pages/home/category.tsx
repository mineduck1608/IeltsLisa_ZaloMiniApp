import Section from "@/components/section";
import TransitionLink from "@/components/transition-link";
import { useEffect, useState } from "react";
import { Class } from "@/types";
import { useSetAtom } from "jotai";
import { classAtom } from "@/state"; // Import atom

export default function Category() {
  const [classFetch, setClassFetch] = useState<Class[]>([]); // State kiểu mảng
  const setClass = useSetAtom(classAtom); // Sử dụng useSetAtom để cập nhật categoriesState

  const FetchClass = async () => {
    try {
      const response = await fetch(
        `https://ieltslisazaloapp.azurewebsites.net/Class/GetAll`
      );
      if (response.ok) {
        const data = await response.json();
        setClassFetch(data); // Cập nhật state local
        setClass(data); // Cập nhật categoriesState trong Jotai
      } else {
        console.error("Failed to fetch class:", response.status);
      }
    } catch (error) {
      console.log("Error when fetching class: " + error);
    }
  };

  useEffect(() => {
    FetchClass();
  }, []);

  return (
    <Section title="Các khóa học tiêu biểu" viewMoreTo="/categories">
      <div className="pt-2.5 pb-4 flex space-x-6 overflow-x-auto px-4">
        {classFetch.length > 0 ? (
          classFetch.map((category) => (
            <TransitionLink
              key={category.classId} // Sử dụng key duy nhất
              className="flex flex-col items-center space-y-2 flex-none basis-[70px] overflow-hidden cursor-pointer"
              to={`/product/${category.classId}`}
            >
              <img
                src={category.classImg}
                className="w-[70px] h-[70px] object-cover rounded-full border-[0.5px] border-black/15"
                alt={category.className}
              />
              <div className="text-center text-sm w-full line-clamp-2 text-subtitle">
                {category.className}
              </div>
            </TransitionLink>
          ))
        ) : (
          <div className="text-subtitle text-center w-full">Không có khóa học nào</div>
        )}
      </div>
    </Section>
  );
}
