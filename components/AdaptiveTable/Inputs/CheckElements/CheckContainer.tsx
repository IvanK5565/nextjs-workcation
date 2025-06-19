/* eslint-disable @typescript-eslint/no-explicit-any */
import Checkbox from '@/components/Form/Checkbox';
import {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FilterType, IOptions} from '@/client/pagination/IPagerParams';

export interface IRadioItemProps {
    name: string;
    option: IOptions;
    checked?: boolean;
    onChange?: (option: IOptions, checked: boolean) => void;
}

interface ICheckContainerProps {
    type: FilterType;

    name: string;
    value: string[];
    items: IOptions[];
    className?: string;
    onChange?: (name: string, value: any) => void;
}

export default function CheckContainer(props: ICheckContainerProps) {
    const {name, value, items, type, onChange, className} = props;
    const {t} = useTranslation();

    const [selectedOptions, setSelected] = useState([]);

    useEffect(() => {
        const selectedOptions =
            value &&
            []
                .concat(value)
                ?.filter((opt: string) =>
                    items?.map(item => item.value).includes(opt),
                );
        const initValue = selectedOptions ? selectedOptions : [];
        setSelected(initValue);
    }, [items, value]);

    const onCheckBoxChange = useCallback(
        (id: string, checked: boolean) => {
            let newOptions = selectedOptions.map(i => i);

            if (checked) {
                newOptions.push(id);
            } else {
                newOptions = selectedOptions?.filter(item => item !== id);
            }

            setSelected(newOptions);
            onChange(name, newOptions);
        },
        [name, onChange, selectedOptions],
    );

    const containerStyle = [FilterType.VerticalCheckBox].includes(type)
        ? ''
        : 'flex space-x-4';
    return (
        <div className={`${containerStyle}`}>
            {items &&
                items.map((opt: IOptions, i: number) => (
                    <Checkbox
                        field={{
                            name: opt?.label,
                        }}
                        form={{errors: {}}}
                        key={`CheckBox_${i}`}
                        className="lg:!w-4 lg:!h-4"
                        onChange={(e: any) => {
                            onCheckBoxChange(
                                opt.value.toString(),
                                e.target?.checked,
                            );
                        }}
                        label={t(opt?.label)}
                        value={!!selectedOptions.includes(opt.value.toString())}
                        labelClassName={className}
                    />
                ))}
        </div>
    );
}
