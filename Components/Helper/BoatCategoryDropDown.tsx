import { useState, useEffect, Fragment } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface BoatCategoryDropdownProps {
  categories: { label: string; value: string }[];
  onSelect: (value: string) => void;
  title: string;
  selectedValue?: string;
}

const BoatCategoryDropdown: React.FC<BoatCategoryDropdownProps> = ({
  categories,
  onSelect,
  title,
  selectedValue,
}) => {
  const [selectedValueState, setSelectedValueState] = useState<string>(
    selectedValue || categories[0]?.value || ''
  );

  useEffect(() => {
    if (selectedValue) {
      setSelectedValueState(selectedValue);
    }
  }, [selectedValue]);

  const handleValueChange = (value: string) => {
    setSelectedValueState(value);
    onSelect(value);
  };

  return (
    <div className="w-full mx-auto border border-gray-300 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Listbox value={selectedValueState} onChange={handleValueChange}>
        <div className="relative mt-1">
          <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
            <span className="block truncate">
              {categories.find((c) => c.value === selectedValueState)?.label ||
                'Select'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {categories.map((category) => (
                <ListboxOption
                  key={category.value}
                  className={({ active }:any) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={category.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {category.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon
                            className="h-5 w-5 text-blue-600"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default BoatCategoryDropdown;
