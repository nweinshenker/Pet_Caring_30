create table users
(
    userId integer primary key,
    name varchar(50) not null
);

create table owner
(
    ownerId integer primary key references users(userId),
    age integer,
    distance decimal
);

create table caretaker
(
    caretakerId integer primary key references users(userId),
    experience varchar(100)
);

create table pet
(
    petId integer primary key,
    age integer not null,
    breed varchar(50) not null,
    foreign key (ownerId) references owner
on delete cascade
);

create table owns
(
    ownerId integer references owner(ownerId),
    petId integer references pet(petId),
    primary key (ownerId, petId)
);-- need to enforce that each owner owns atleast 1 pet

create table cat
(
    petId integer primary key references pet(petId)
);

create table dog
(
    petId integer primary key references pet(petId),
    sizeOfPet varchar(10) not null,
    temper varchar(10) not null
);

create table services
(
    serviceId integer primary key,
    name varchar(50) not null
);

create table list
(
    listId int primary key,
    caretakerId int references caretaker(caretakerId),
    serviceId int references services(serviceId),
    basePrice int not null,
    time timestamp not null
);

create table provides
(
    caretakerId integer references caretaker(caretakerId),
    serviceId integer references services(serviceId),
    price integer not null,
    primary key (caretakerId, serviceId)
);-- need to enforce that each caretaker has atleast 1 service(not there in the ER model)

create table cares
(
    caretakerId integer references caretaker(caretakerId),
    petId integer references pet(petId),
    serviceId int references services(serviceId),
    price integer not null,
    time timestamp not null,
    review varchar(100),
    primary key (caretakerId, petId, serviceId)
);--look into how values are inserted in this table

--create table availaibility(
--caretakerId int references caretaker(caretakerId),
--serviceId int references service(serviceId),
--listId int references list(listId)
--primary key() 
--);

create table athome
(
    serviceId integer primary key references services(serviceID)
    -- extra fields like home key or user authentication required. See how it translates to the functional requirements
);

create table notathome
(
    serviceId integer primary key references services(serviceID)
);

create table bid
(
    ownerId integer references owner(ownerId),
    listId int references list(listId),
    price integer not null,
    primary key(ownerId, listId)
);

<-- 
LANGUAGE plpgsql;

CREATE TRIGGER lower_bid
BEFORE INSERT OR UPDATE
ON LIST 
FOR EACH ROW
EXECUTE PROCEDURE lower_bid();


CREATE OR REPLACE FUNCTION lower_bid() RETURNS TRIGGER AS $ret$
$$
DECLARE 
