const PUBLIC_PATH = '/familie/sykdom-i-familien/soknad/omsorgspenger';

describe('Kan jeg bruke den digitale omsorgspengesøknaden', () => {
    before(() => {
        cy.visit(`${PUBLIC_PATH}/`);
    });

    context('Radioknapp gruppen', () => {
        it('Har 2 radio knapper', () => {
            cy.get('[name="harKroniskSyktBarn"]').should('have.length', 2);
        });
        it('Både Ja og Nei knappene er unchecked', () => {
            cy.get('[name="harKroniskSyktBarn"]').parent().find('input').should('not.be.checked');
        });
    });
    describe('Har du et barn som har en kronisk sykdom eller funksjonshemming?', () => {
        context('Ja, jeg har kronisk sykt barn', () => {
            it('Linken til søknaden er synlig', () => {
                cy.get('[type="radio"]').first().check({ force: true }); // Må, bruke force her, pga cypress tror radio-knappen har størrelse (0,0)
                cy.get('a.lenke'); // Sjekk at lenken finnes
            });
        });
        context('Nei, jeg har ikke syke barn', () => {
            it('Info panelet er synlig', () => {
                cy.get('[type="radio"]').last().check({ force: true }); // Må, bruke force her, pga cypress tror radio-knappen har størrelse (0,0)
                cy.dataCy('harIkkeKroniskSyktBarn'); // Custom command; <==> cy.get('[data-cy="erSelvstendigEllerFrilanser"');
            });
        });
    });
});
