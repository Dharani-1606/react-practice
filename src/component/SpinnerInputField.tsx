import { useState } from "react";
import "./InputSpinner.css";

export default function SpinnerInputField() {
  const [value, setValue] = useState(0);

  const increment = () => setValue((prev) => prev + 1);

  const decrement = () => {
    setValue((prev) => Math.max(0, prev - 1));
  };

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setValue(isNaN(val) ? 0 : val);
  };

  return (
    <div className="input-spinner">
      <button onClick={decrement}>−</button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
      />
      <button onClick={increment}>+</button>
    </div>
  );
}