/**
 * @class
 * @property {number} id
 * @property {string} clothe_type
 */
class Clothe {
    constructor(id, clothe_type) {
        this.id = id;
        this.clothe_type = clothe_type;
    }
}

/**
 * @class
 * @property {string} email
 * @property {string} password
 */
class Credentials {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

/**
 * @class
 * @property {number} id
 * @property {string} email
 * @property {string} customer_name
 * @property {string} surname
 * @property {string} birth_date
 * @property {string} gender
 * @property {string} customer_description
 * @property {string} astrological_sign
 * @property {string} phone_number
 * @property {string} address
 */
class Customer {
    constructor(id, email, customer_name, surname, birth_date, gender, customer_description, astrological_sign, phone_number, address) {
        this.id = id;
        this.email = email;
        this.customer_name = customer_name;
        this.surname = surname;
        this.birth_date = birth_date;
        this.gender = gender;
        this.customer_description = customer_description;
        this.astrological_sign = astrological_sign;
        this.phone_number = phone_number;
        this.address = address;
    }
}

/**
 * @class
 * @property {number} id
 * @property {string} email
 * @property {string} employee_name
 * @property {string} surname
 * @property {string} birth_date
 * @property {string} gender
 * @property {string} work
 */
class Employee {
    constructor(id , email, employee_name, surname, birth_date, gender, work) {
        this.id = id;
        this.email = email;
        this.employee_name = employee_name;
        this.surname = surname;
        this.birth_date = birth_date;
        this.gender = gender;
        this.work = work;
    }
}

/**
 * @class
 * @property {number} id
 * @property {number} customer_id
 * @property {string} date
 * @property {number} rating
 * @property {string} comment
 * @property {string} source
 */
class Encounter {
    constructor(id, customer_id, date, rating, comment, source) {
        this.id = id;
        this.customer_id = customer_id;
        this.date = date;
        this.rating = rating;
        this.comment = comment;
        this.source = source;
    }
}

/**
 * @class
 * @property {number} id
 * @property {string} event_name
 * @property {string} date
 * @property {string} duration
 * @property {number} max_participants
 * @property {number} location_x
 * @property {number} location_y
 * @property {string} type
 * @property {number} employee_id
 * @property {string} location_name
 */
class Event {
    constructor(id, event_name, date, duration, max_participants, location_x, location_y, event_type, employee_id, location_name) {
        this.id = id;
        this.event_name = event_name;
        this.date = date;
        this.duration = duration;
        this.max_participants = max_participants;
        this.location_x = location_x;
        this.location_y = location_y;
        this.event_type = event_type;
        this.employee_id = employee_id;
        this.location_name = location_name;
    }
}

/**
 * @class
 * @property {string} detail
 */
class HTTPError {
    constructor(detail) {
        this.detail = detail;
    }
}

/**
 * @class
 * @property {array<item>, string, string} detail
 */
class HTTPValidationError {
    constructor(detail) {
        this.detail = detail;
    }
}

/**
 * @class
 * @property {number} id
 * @property {string} date
 * @property {string} payment_method
 * @property {number} amount
 * @property {string} comment
 */
class PaymentHistory {
    constructor(id, date, payment_method, amount, comment) {
        this.id = id;
        this.date = date;
        this.payment_method = payment_method;
        this.amount = amount;
        this.comment = comment;
    }
}

/**
 * @class
 * @property {number} id
 * @property {string} email
 * @property {string} shortCustomer_name
 * @property {string} surname
 */
class ShortCustomer {
    constructor(id, email, shortCustomer_name, surname) {
        this.id = id;
        this.email = email;
        this.shortCustomer_name = shortCustomer_name;
        this.surname = surname;
    }
}

/**
 * @class
 * @property {number} id
 * @property {string} email
 * @property {string} shortEmployee_name
 * @property {string} surname
 */
class ShortEmployee {
    constructor(id, email, shortEmployee_name, surname) {
        this.id = id;
        this.email = email;
        this.shortEmployee_name = shortEmployee_name;
        this.surname = surname;
    }
}

/**
 * @class
 * @property {number} id
 * @property {number} customer_id
 * @property {string} date
 * @property {number} rating
 */
class ShortEncounter {
    constructor(id, customer_id, date, rating) {
        this.id = id;
        this.customer_id = customer_id;
        this.date = date;
        this.rating = rating;
    }
}

/**
 * @class
 * @property {number} id
 * @property {string} name
 * @property {string} date
 * @property {number} duration
 * @property {number} max_participants
 */
class ShortEvent {
    constructor(id, shortEvent_name, date, duration, max_participants) {
        this.id = id;
        this.shortEvent_name = shortEvent_name;
        this.date = date;
        this.duration = duration;
        this.max_participants = max_participants;
    }
}

/**
 * @class
 * @property {number} id
 * @property {string} title
 * @property {string} tip
 */
class Tip {
    constructor(id, title, tip) {
        this.id = id;
        this.title = title;
        this.tip = tip;
    }
}

/**
 * @class
 * @property {string} access_token
 */
class Token {
    constructor(access_token) {
        this.access_token = access_token;
    }
}

/**
 * @class
 * @property {Array<(string | number)>} loc
 * @property {string} msg
 * @property {string} error_type
 */
class ValidationError {
    constructor(loc, msg, error_type) {
        this.loc = loc;
        this.msg = msg;
        this.error_type = error_type;
    }
}

module.exports.Clothe = Clothe;
module.exports.Credentials = Credentials;
module.exports.Customer = Customer;
module.exports.Employee = Employee;
module.exports.Encounter = Encounter;
module.exports.Event = Event;
module.exports.HTTPError = HTTPError;
module.exports.HTTPValidationError = HTTPValidationError;
module.exports.PaymentHistory = PaymentHistory;
module.exports.ShortCustomer = ShortCustomer;
module.exports.ShortEmployee = ShortEmployee;
module.exports.ShortEncounter = ShortEncounter;
module.exports.ShortEvent = ShortEvent;
module.exports.Tip = Tip;
module.exports.Token = Token;
module.exports.ValidationError = ValidationError;
