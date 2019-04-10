-- noinspection SqlNoDataSourceInspectionForFile

create table users
(
    userId   varchar(50) primary key,
    name     varchar(50)  not null,
    password varchar(100) not null
);

create table owner
(
    ownerId varchar(50) primary key references users(userId)
    	on delete cascade,
    age integer
);

create table caretaker
(
    caretakerId varchar(50) primary key references users(userId)
    	on delete cascade,
    experience varchar(100)
);

create table petowned
(
    petnum varchar(50) unique,
    name varchar(50) not null,
    ownerId varchar(50),
    age integer not null,
    foreign key (ownerId) references owner
        on delete cascade,
    primary key (petnum, ownerId)
);-- need to enforce that each owner owns atleast 1 pet

create table cat
(
    petnum varchar(50) references petowned (petnum)
    	on delete cascade,
    ownerId varchar(50) references owner,
    breed varchar(50) not null,
    primary key(petnum, ownerId)
);

create table dog
(
    petnum varchar(50) references petowned (petnum)
    	on delete cascade,
    ownerId varchar(50) references owner,
    sizeOfPet varchar(10) not null,
    breed varchar(50) not null,
    temper varchar(10) not null,
    primary key(petnum, ownerId)
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
    available_dates date not null,
    unique(listId, caretakerId, available_dates)
);

create table provides
(
    caretakerId varchar(50) references caretaker(caretakerId),
    serviceId varchar(50) references services(serviceId),
    primary key (caretakerId, serviceId)
);-- need to enforce that each caretaker has atleast 1 service(not there in the ER model)

create table cares
(
    caretakerId varchar(50) references caretaker(caretakerId),
    petnum varchar(50) references petowned (petnum),
    ownerId varchar(50) references owner,
    serviceId varchar(50) references services(serviceId),
    price integer not null,
    selected_date date not null,
    review varchar(100),
    primary key (caretakerId, petnum, ownerId, serviceId)
);--look into how values are inserted in this table
-- where does review come from?

--create table availaibility(
--caretakerId int references caretaker(caretakerId),
--serviceId int references service(serviceId),
--listId int references list(listId)
--primary key()
--);

create table athome
(
    serviceId varchar(50) primary key references services(serviceID)
    	on delete cascade
    -- extra fields like home key or user authentication required. See how it translates to the functional requirements
);

create table notathome
(
    serviceId varchar(50) primary key references services(serviceID)
    	on delete cascade
);

create table bid
(
    ownerId varchar(50) references owner(ownerId),
    listId varchar(50) references list(listId),
    price integer not null,
    petNum varchar(50) references petowned(petnum),
    primary key(ownerId, listId, price)
);


-- triggers

-- trigger 1 - bid must be higher than max bid

CREATE OR REPLACE FUNCTION min_bid()
RETURNS TRIGGER AS 
$$
DECLARE maxPrice numeric;
BEGIN 
    select coalesce(max(basePrice),0) into maxPrice
    from list;
    if NEW.basePrice <= maxPrice then
        RAISE NOTICE ‘bid must be higher than current maximum bid’;
        return null;
    else
        return new;
    end if;
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER minBid
BEFORE INSERT OR UPDATE ON list
FOR EACH ROW
EXECUTE PROCEDURE min_bid();


-- trigger 2 (not working yet)
-- automatically push highest price etc into cares table 
-- every time someone bids

CREATE OR REPLACE FUNCTION push_bid()
RETURNS TRIGGER AS 
$$
DECLARE cid varchar(50); sid varchar(50); ad date; 
BEGIN 
    SELECT caretakerId into cid, serviceId into sid, available_dates into ad
    FROM list l
    where l.listId = new.listId;
    INSERT INTO cares VALUES
    (cid, new.petNum, new.ownerId, sid, new.price, ad, null);
    RAISE NOTICE ‘bidding details pushed to cares table’;
    RETURN NULL;
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER pushBid
AFTER INSERT OR UPDATE ON bid
FOR EACH ROW
EXECUTE PROCEDURE push_bid();




-- trigger 3

CREATE OR replace FUNCTION trig_func3()
    returns TRIGGER AS
$$
DECLARE occurrence Integer;
BEGIN
    SELECT COUNT(*) FROM bid b WHERE b.listId = NEW.listId into occurrence;
    IF occurrence > 0 THEN
        raise notice 'Update not valid';
        RETURN null;
    ELSE
        raise notice 'Update valid';
        RETURN NEW;
    END IF;
END;
$$
    LANGUAGE plpgsql;

CREATE TRIGGER trig3
    BEFORE UPDATE ON list
    FOR EACH ROW
EXECUTE PROCEDURE trig_func3();