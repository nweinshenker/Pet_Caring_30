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
    unique(serviceId, caretakerId, available_dates)
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
    serviceId varchar(50) references services(serviceId),
    selected_date date not null,
    listId varchar(50) references list(listId),
    petnum varchar(50) references petowned (petnum),
    ownerId varchar(50) references owner,
    price integer not null,
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

create table catservices
(
    serviceId varchar(50) primary key references services(serviceID)
    	on delete cascade
    -- extra fields like home key or user authentication required. See how it translates to the functional requirements
);

create table dogservices
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
DECLARE  existence integer;
DECLARE maxPrice integer;
BEGIN
    select count(*) from bid b1 where NEW.listId=b1.listId into existence;
    if existence > 0 then
        select price from bid b where NEW.listId=b.listId order by price desc limit 1 into maxPrice;
            if NEW.price > maxPrice then
                raise notice 'Successful bid';
                return NEW;
            else
                raise notice 'Bid failed! Enter a higher price.';
                return null;
            end if;
    else
        raise notice 'New bid successful';
        return NEW;
    end if;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER minBid
BEFORE INSERT OR UPDATE ON bid
FOR EACH ROW
EXECUTE PROCEDURE min_bid();

-- trigger 2
-- automatically push highest price etc into cares table
-- every time someone bids

CREATE OR REPLACE FUNCTION push_bid()
RETURNS TRIGGER AS
$$
DECLARE count1 integer; cid varchar(50); sid varchar(50); ad date;
BEGIN
    SELECT count(*) from cares c where c.listId = NEW.listId into count1;
    IF count1 > 0 then
        DELETE from cares c1 where c1.listId = NEW.listId;
        raise notice 'old entry deleted';
    end if;
    SELECT caretakerId from list l where l.listId = NEW.listId into cid;
    SELECT serviceId from list l where l.listId = NEW.listId into sid;
    SELECT available_dates from list l where l.listId = NEW.listId into ad;
    INSERT INTO cares VALUES
    (cid, sid, ad, NEW.listId, new.petNum, new.ownerId, new.price, null);
    RAISE NOTICE 'bidding details pushed to cares table';
    RETURN NULL;
 END;
$$
    LANGUAGE plpgsql;

CREATE TRIGGER pushBid
AFTER INSERT OR UPDATE ON bid
FOR EACH ROW
EXECUTE PROCEDURE push_bid();

-- trigger 3
-- prevents updating an available list entry by the caretaker if it's already been bid upon

CREATE OR replace FUNCTION bid_validity()
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

CREATE TRIGGER bid_sanitize
    BEFORE UPDATE ON list
    FOR EACH ROW
EXECUTE PROCEDURE bid_validity();