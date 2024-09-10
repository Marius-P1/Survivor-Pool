export class ShortCustomersDTO {
    id: number;
    name: string;
    surname: string;
    email: string;

    constructor(id: number, name: string, surname: string, email: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
}

export class CustomerDTO {
    id: number;
    email: string;
    name: string;
    surname: string;
    birthdate: string;
    gender: string;
    description: string;
    astrological_sign: string;
    phone_number: string;
    address: string;

    constructor(id: number, email: string, name: string, surname: string, birthdate: string, gender: string, description: string, astrological_sign: string, phone_number: string, address: string) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
        this.gender = gender;
        this.description = description;
        this.astrological_sign = astrological_sign;
        this.phone_number = phone_number;
        this.address = address;
    }
}
