import { ajaxResponses } from './mock/elementor-common';
import { fireEvent, screen } from '@testing-library/react';

export const sleep = ( ms ) => new Promise( ( resolve ) => setTimeout( resolve, ms ) );

export const assertUniqueIds = ( expected ) => {
	for ( const [ id, expectedUnique ] of Object.entries( expected ) ) {
		const ids = ajaxResponses.ai_generate_layout.map( ( { request } ) => request.data.ids[ id ] );
		const uniqueIds = new Set( ids );

		try {
			expect( ids.length ).toEqual( expected.requestId );
			expect( uniqueIds.size ).toEqual( expectedUnique );
		} catch ( e ) {
			throw new Error( `Failed asserting that ${ id } has ${ expectedUnique } unique ids` );
		}
	}
};

export const addPromptAndGenerate = ( prompt ) => {
	const wrapper = screen.getByTestId( 'root' );

	fireEvent.change( wrapper.querySelector( 'textarea' ), {
		target: { value: prompt },
	} );

	fireEvent.click( screen.getByText( /^generate/i ) );
};

export const clickEditPromptButton = () => {
	const wrapper = screen.getByTestId( 'root' );
	const editButton = wrapper.querySelector( '[aria-label="Edit prompt"] button' );
	fireEvent.click( editButton );
};
