/**
 * External dependencies
 */
import { createElement, createContext, useContext } from '@wordpress/element';

type FillConfigType = {
	visible: boolean;
};

type FillType = Record< string, FillConfigType >;

type FillCollection = readonly ( readonly JSX.Element[] )[];

export type SlotContextHelpersType = {
	hideFill: ( id: string ) => void;
	showFill: ( id: string ) => void;
};

export type SlotContextType = {
	fills: FillType;
	getFillHelpers: () => SlotContextHelpersType;
	registerFill: ( id: string ) => void;
	filterRegisteredFills: ( fillsArrays: FillCollection ) => FillCollection;
};

export const SlotContextPrototype: SlotContextType = ( () => {
	const fills: FillType = {};

	const registerFill = ( id: string ) => {
		if ( fills[ id ] ) {
			return;
		}
		fills[ id ] = { visible: true };
	};

	const hideFill = ( id: string ) => {
		if ( fills[ id ] ) {
			fills[ id ].visible = false;
		}
	};

	const showFill = ( id: string ) => {
		if ( fills[ id ] ) {
			fills[ id ].visible = true;
		}
	};

	return {
		registerFill,
		getFillHelpers() {
			return { hideFill, showFill };
		},
		filterRegisteredFills( fillsArrays: FillCollection ) {
			return fillsArrays.filter(
				( arr ) => fills[ arr[ 0 ].props._id ]?.visible !== false
			);
		},
		fills,
	};
} )();

export const SlotContext = createContext( SlotContextPrototype );

export const useSlotContext = () => useContext( SlotContext );
