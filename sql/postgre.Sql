create table users
(
    userId varchar(50) primary key,
    password varchar(60) not null,
    name varchar(50) not null
);

create table owner
(
    ownerId varchar(50) primary key references users(userId),
    age integer
);

create table caretaker
(
    caretakerId varchar(50) primary key references users(userId),
    experience varchar(100)
);

create table pet
(
    petId varchar(50) primary key,
    ownerId varchar(50),
    age integer not null,
    foreign key (ownerId) references owner
        on delete cascade
);-- need to enforce that each owner owns atleast 1 pet

create table cat
(
    petId varchar(50) primary key references pet(petId),
    breed varchar(50) not null
);

create table dog
(
    petId varchar(50) primary key references pet(petId),
    sizeOfPet varchar(10) not null,
    breed varchar(50) not null,
    temper varchar(10) not null
);

create table services
(
    serviceId varchar(50) primary key,
    name varchar(50) not null
);

create table list
(
    listId varchar(50) primary key,
    caretakerId varchar(50) references caretaker(caretakerId),
    serviceId varchar(50) references services(serviceId),
    basePrice int not null,
    time timestamp not null
);

create table provides
(
    caretakerId varchar(50) references caretaker(caretakerId),
    serviceId varchar(50) references services(serviceId),
    price integer not null,
    primary key (caretakerId, serviceId)
);-- need to enforce that each caretaker has atleast 1 service(not there in the ER model)

create table cares
(
    caretakerId varchar(50) references caretaker(caretakerId),
    petId varchar(50) references pet(petId),
    serviceId varchar(50) references services(serviceId),
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
    serviceId varchar(50) primary key references services(serviceID)
    -- extra fields like home key or user authentication required. See how it translates to the functional requirements
);

create table notathome
(
    serviceId varchar(50) primary key references services(serviceID)
);

create table bid
(
    ownerId varchar(50) references owner(ownerId),
    listId varchar(50) references list(listId),
    price integer not null,
    primary key(ownerId, listId)
);