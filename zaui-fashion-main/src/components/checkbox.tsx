export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none cursor-pointer text-primary"
      onClick={() => props.onChange(!props.checked)}
    >
      {props.checked ? (
        <>
          <path
            d="M0.5 8C0.5 3.58172 4.08172 0 8.5 0H16.5C20.9183 0 24.5 3.58172 24.5 8V16C24.5 20.4183 20.9183 24 16.5 24H8.5C4.08172 24 0.5 20.4183 0.5 16V8Z"
            fill="currentcolor"
          />
          <path
            d="M7 12.5L10.5 16L18 8.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M1.5 8C1.5 4.13401 4.63401 1 8.5 1H16.5C20.366 1 23.5 4.13401 23.5 8V16C23.5 19.866 20.366 23 16.5 23H8.5C4.63401 23 1.5 19.866 1.5 16V8Z"
            fill="white"
          />
          <path
            d="M1.5 8C1.5 4.13401 4.63401 1 8.5 1H16.5C20.366 1 23.5 4.13401 23.5 8V16C23.5 19.866 20.366 23 16.5 23H8.5C4.63401 23 1.5 19.866 1.5 16V8Z"
            stroke="#C2C7CB"
            strokeWidth="2"
          />
        </>
      )}
    </svg>
  );
}
