import { forwardRef, useEffect, useState } from "react";
// import { motion } from "framer-motion";

const Input = forwardRef(({ type, name, id, placeholder, defaultValue, fieldError, ariaDescribedBy }, ref) => {
    // const actionData = useActionData();
    const [isClientError, setIsClientError] = useState(true);
    // const errorState = isClientError && fieldError;
    // const inputRef = useRef(null);

    function handleChange() {
        setIsClientError(false);
    }

    // useEffect(() => {
    //     if (transition.submission) {
    //         setIsClientError(true);
    //     }
    // }, [transition]);
    // TODO: Fix the flash of error message upon submission
    return (
        <>
            {type === 'textarea'
                ? (<textarea
                    ref={ref}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    onChange={handleChange}
                    aria-describedby={ariaDescribedBy}
                    className={`block w-full px-3 py-2 border border-gray-100 bg-transparent rounded text-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-white transition ease-in-out duration-300 ${fieldError ? 'border-red-700' : 'border-gray-400'}`}
                />)
                : (<input
                    ref={ref}
                    type={type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    onChange={handleChange}
                    defaultValue={defaultValue}
                    aria-describedby={ariaDescribedBy}
                    min={type === 'number' ? 1 : undefined}
                    // onBlur={handleBlur}
                    // onBlur={onBlur}
                    className={`block w-full px-3 py-2 border border-gray-100 bg-transparent rounded text-gray-200  focus:border-none focus:outline-none focus:ring-2 focus:ring-white transition ease-in-out duration-300 ${fieldError ? 'border-red-700' : 'border-gray-400'}`}
                />)
            }

            {
                fieldError
                    ? (<span
                        className="pt-1 text-red-600 inline text-sm transition ease-in-out duration-300" id="email-error"
                    // initial={{ opacity: 0 }}
                    // animate={{ opacity: 1 }}
                    // transition={{ duration: 1.5 }}
                    >
                        {fieldError}
                    </span>)
                    : <>&nbsp;</>
            }
        </>

    );
})

export default Input;