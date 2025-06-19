/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEvent, useCallback, useMemo } from 'react';
import { Actions } from '@/client/pagination/IPagerParams';
import { isFunction } from '@/client/utils/random';
import {
    FaBars,
    FaEdit,
    FaEdit2,
    FaEye,
    FaFileAlt,
    FaPlus,
    FaReSearch,
    FaTrash
} from '../FaIcons/icons';

interface IActionItemProps {
    action: Actions;
    data: any;
    className?: string;
    buttonClassName?: string;
    onActionClick?: (action: Actions, data: any) => void;
    actionIsDisabled?: (action: Actions, data: any) => boolean;
    isActive?: boolean;
}

export default function ActionItem(props: IActionItemProps) {
    const {
        data,
        action,
        onActionClick,
        actionIsDisabled: isActionActivePredicate,
        className,
        isActive,
    } = props;

    const isDisabled = useMemo(
        () =>
            isActionActivePredicate
                ? isActionActivePredicate(action, data)
                : false,
        [action, data, isActionActivePredicate],
    );
    const actionClickHandler = useCallback(
        (e: MouseEvent) => {
            if (isFunction(onActionClick)) {
                e.stopPropagation();
                if (onActionClick) {
                    onActionClick(action, data);
                }
            }
        },
        [action, data, onActionClick],
    );

    const {color, reactIcon, iconClassName} = useMemo((): {
        color: string;
        reactIcon: any;
        iconClassName: any;
    } => {
        switch (action) {
            default:
            case Actions.Image:
                return {
                    color: `table-icon text-green-600 border-2 border-green-600 rounded-full p-1 ${
                        isDisabled
                            ? 'text-green-200 border-green-200'
                            : 'hover:text-white  hover:bg-green-600'
                    }`,
                    reactIcon: <FaEye />,
                    iconClassName: 'text-lg',
                };
            case Actions.Add:
                return {
                    color: `table-icon w-[1.625rem] h-[1.625rem] text-white  grid place-items-center rounded-full ${
                        isDisabled
                            ? ''
                            : 'hover:text-[#FC9146] hover:bg-[#FFFFFF]'
                    }`,
                    reactIcon: <FaPlus className="w-[1.25rem] h-[1.25rem]" />,
                    iconClassName: '',
                };
            case Actions.Edit:
                return {
                    color: `table-icon w-[1.625rem] h-[1.625rem] rounded-[6.25rem] grid place-items-center`,
                    reactIcon: (
                        <FaEdit2
                            className={`w-6 h-6 ${
                                isActive ? 'text-[#FC9146]' : 'text-white'
                            }`}
                        />
                    ),
                    iconClassName: '',
                };
            case Actions.Request:
                return {
                    color: 'table-icon text-blue-300 hover:bg-blue-600',
                    reactIcon: <FaFileAlt />,
                    iconClassName: '',
                };
            case Actions.Delete:
                return {
                    color: `table-icon w-[1.625rem] h-[1.625rem] rounded-[6.25rem] grid place-items-center border-2 ${
                        isActive ? 'border-white' : 'border-[#737373]'
                    } ${
                        isDisabled
                            ? 'border-[#73737340]'
                            : 'hover:bg-[#73737350]'
                    }`,
                    reactIcon: (
                        <FaTrash
                            className={`w-[0.938rem] h-[0.938rem] ${
                                isActive ? 'fill-white' : 'fill-[#737373]'
                            } ${isDisabled ? 'fill-[#73737340]' : ''}`}
                        />
                    ),
                    iconClassName: '',
                };
            //case: Actions.MenuDelete
            case Actions.Move:
                return {
                    color: 'menu-action-icon text-black-500',
                    reactIcon: <FaBars />,
                    iconClassName: '',
                };
            case Actions.EditSmall:
                return {
                    color: 'table-icon table-icon-sm text-blue-300 hover:bg-blue-600 w-1 h-1',
                    reactIcon: <FaEdit />,
                    iconClassName: '',
                };
            case Actions.ReSearch:
                return {
                    color: 'hover:brightness-125  bg-[#FC9146] rounded-full w-[24px] h-[24px] flex items-center justify-center',
                    reactIcon: (
                        <FaReSearch className="text-white w-[20px] h-[20px]" />
                    ),
                    iconClassName: '',
                };
        }
    }, [action, isActive, isDisabled]);

    if (isDisabled) {
        return null;
    }
    return (
        <button
            type="button"
            className={`mx-1 transition-all ${color} ${className}`}
            onClick={actionClickHandler}
            disabled={isDisabled}>
            <span className={`${iconClassName}`}>{reactIcon}</span>
        </button>
    );
}
