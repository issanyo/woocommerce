/**
 * External dependencies
 */
import {
	createElement,
	createContext,
	useContext,
	useState,
} from '@wordpress/element';

type FillConfigType = {
	visible: boolean;
};

type FillType = Record< string, FillConfigType >;

type FillCollection = readonly ( readonly JSX.Element[] )[];

export type SlotContextHelpersType = {
	hideFill: ( id: string ) => void;
	showFill: ( id: string ) => void;
	getFills: () => FillType;
};

export type SlotContextType = {
	fills: FillType;
	getFillHelpers: () => SlotContextHelpersType;
	registerFill: ( id: string ) => void;
	filterRegisteredFills: ( fillsArrays: FillCollection ) => FillCollection;
};

const SlotContext = createContext< SlotContextType | undefined >( undefined );

export const SlotContextProvider: React.FC = ( { children } ) => {
	const [ fills, setFills ] = useState< FillType >( {} );

	const registerFill = ( id: string ) => {
		if ( fills[ id ] ) {
			return;
		}
		setFills( { ...fills, [ id ]: { visible: true } } );
	};

	const hideFill = ( id: string ) => {
		if ( fills[ id ] ) {
			setFills( {
				...fills,
				[ id ]: { ...fills[ id ], visible: false },
			} );
		}
	};

	const showFill = ( id: string ) => {
		if ( fills[ id ] ) {
			setFills( { ...fills, [ id ]: { ...fills[ id ], visible: true } } );
		}
	};

	const getFills = () => ( { ...fills } );

	return (
		<SlotContext.Provider
			value={ {
				registerFill,
				getFillHelpers() {
					return { hideFill, showFill, getFills };
				},
				filterRegisteredFills( fillsArrays: FillCollection ) {
					return fillsArrays.filter(
						( arr ) =>
							fills[ arr[ 0 ].props._id ]?.visible !== false
					);
				},
				fills,
			} }
		>
			{ children }
		</SlotContext.Provider>
	);
};

export const useSlotContext = () => {
	const slotContext = useContext( SlotContext );

	if ( slotContext === undefined ) {
		throw new Error(
			'useSlotContext must be used within a SlotContextProvider'
		);
	}

	return slotContext;
};
