export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn: string;
    kjønn: string;
    fødselsnummer: string;
}

export interface Søkerdata {
    person: Person;
}

export interface BarnReceivedFromApi {
    fornavn: string;
    etternavn: string;
    mellomnavn?: string;
    aktørId: string;
    fødselsdato: Date;
}
