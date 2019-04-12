-- noinspection SqlNoDataSourceInspectionForFile

drop table if exists users cascade;
drop table if exists owner cascade;
drop table if exists caretaker cascade;
drop table if exists petowned cascade;
drop table if exists cat cascade;
drop table if exists dog cascade;
drop table if exists services cascade;
drop table if exists list cascade;
drop table if exists provides cascade;
drop table if exists cares cascade;
drop table if exists catservices cascade;
drop table if exists dogservices cascade;
drop table if exists bid cascade;

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
    petnum varchar(50) references petowned (petnum) on delete cascade,
    ownerId varchar(50) references owner,
    price integer not null,
    review varchar(100),
    primary key (listId)
);

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
    petNum varchar(50) references petowned(petnum) on delete cascade,
    primary key(ownerId, listId, price)
);

insert into users values ('nathan@gmail.com','Nathan Weinshenker','$2b$10$LYCLNdvbYb9vI5veaZQT9OxmtZlT3JDJYU3Sh1OqlH9sw2hb.sakK'),
                         ('caroline@gmail.com','Caroline Busse','$2b$10$LYCLNdvbYb9vI5veaZQT9OxmtZlT3JDJYU3Sh1OqlH9sw2hb.sakK'),
                         ('tarush@gmail.com','Tarush Agarwal','$2b$10$LYCLNdvbYb9vI5veaZQT9OxmtZlT3JDJYU3Sh1OqlH9sw2hb.sakK'),
                         ('div@gmail.com','Divyansh Singh','$2b$10$LYCLNdvbYb9vI5veaZQT9OLq.zXjzkGKCLjdMOArUz6rdDFAWZz6G'),
                         ('ben@gmail.com','Benedict Cumberbatch','$2b$10$LYCLNdvbYb9vI5veaZQT9OUaJWRK7JVvY3StCoz9Kvg7HdlPCF//y'),
                         ('mark@gmail.com','Mark Rogers','$2b$10$LYCLNdvbYb9vI5veaZQT9O46/v6vWQE22JIBcqBx5Y1zeLh4J1CCu'),
                         ('ed@gmail.com','Edwin','$2b$10$LYCLNdvbYb9vI5veaZQT9OZM.WEberun9GdVZfnWDHduySLNDHh5G'),
                         ('rob@gmail.com','Robert Downey Jr','$2b$10$LYCLNdvbYb9vI5veaZQT9Ok..FgXAeGOARRSdoY/CevnXdFqoyC56'),
                         ('blackwidow@gmail.com','Scarlett Johansson', '$2b$10$LYCLNdvbYb9vI5veaZQT9Os1WKETP/sJPc1jHbCYNuqyuMqmODmd.'),
                         ('tyrion@gmail.com','Tyrion Lannister','$2b$10$LYCLNdvbYb9vI5veaZQT9OLg0JGO1sTEvSqkS8TqKkwbkbdC.7UI2');

insert into owner values ('nathan@gmail.com',21),
                         ('tarush@gmail.com',20),
                         ('ed@gmail.com',NULL),
                         ('blackwidow@gmail.com',31),
                         ('tyrion@gmail.com',29);

insert into caretaker values('caroline@gmail.com','experienced'),
                            ('tarush@gmail.com','moderate'),
                            ('div@gmail.com',NULL),
                            ('ben@gmail.com','amateur'),
                            ('mark@gmail.com',NULL),
                            ('rob@gmail.com','moderate'),
                            ('blackwidow@gmail.com','moderate'),
                            ('tyrion@gmail.com','experienced');

insert into petowned values ('1','max','nathan@gmail.com',4),
                            ('2','buddy','nathan@gmail.com',5),
                            ('3','lucy','tarush@gmail.com',2),
                            ('4','chloe','ed@gmail.com',2),
                            ('5','callie','blackwidow@gmail.com',3),
                            ('6','rocky','blackwidow@gmail.com',6),
                            ('7','jack','blackwidow@gmail.com',6),
                            ('8','milo','tyrion@gmail.com',6),
                            ('9','duke','tyrion@gmail.com',7);

insert into cat values ('3','tarush@gmail.com','British Shorthair'),
                       ('4','ed@gmail.com','Siamese cat'),
                       ('5','blackwidow@gmail.com','Russian Blue'),
                       ('8','tyrion@gmail.com','Sphynx cat');

insert into dog values ('1','nathan@gmail.com','small','Poodle','calm'),
                       ('2','nathan@gmail.com','medium','Poodle','calm'),
                       ('6','blackwidow@gmail.com','large','Golden Retriever','moody'),
                       ('7','blackwidow@gmail.com','large','Golden Retriever','quiet'),
                       ('9','tyrion@gmail.com','medium','Bulldog','aggressive');

insert into services values ('1','dog walking'),
                            ('2','pet grooming'),
                            ('3','cat sitters'),
                            ('4','bath');

insert into list values ('1','caroline@gmail.com','2',100,to_date('16 04 2019','DD MM YYYY')),
                        ('2','caroline@gmail.com','3',60,to_date('16 04 2019','DD MM YYYY')),
                        ('3','caroline@gmail.com','4',90,to_date('17 04 2019','DD MM YYYY')),
                        ('4','caroline@gmail.com','2',110,to_date('19 04 2019','DD MM YYYY')),
                        ('5','caroline@gmail.com','3',60,to_date('18 04 2019','DD MM YYYY')),
                        ('6','caroline@gmail.com','3',50,to_date('20 04 2019','DD MM YYYY')),
                        ('7','tarush@gmail.com','2',85,to_date('19 04 2019','DD MM YYYY')),
                        ('8','tarush@gmail.com','2',85,to_date('18 04 2019','DD MM YYYY')),
                        ('9','div@gmail.com','1',90,to_date('18 04 2019','DD MM YYYY')),
                        ('10','div@gmail.com','1',80,to_date('17 04 2019','DD MM YYYY')),
                        ('11','div@gmail.com','2',100,to_date('18 04 2019','DD MM YYYY')),
                        ('12','ben@gmail.com','3',70,to_date('18 04 2019','DD MM YYYY')),
                        ('13','mark@gmail.com','4',120,to_date('18 04 2019','DD MM YYYY')),
                        ('14','mark@gmail.com','4',120,to_date('16 04 2019','DD MM YYYY')),
                        ('15','rob@gmail.com','2',100,to_date('19 04 2019','DD MM YYYY')),
                        ('16','rob@gmail.com','4',110,to_date('19 04 2019','DD MM YYYY')),
                        ('17','blackwidow@gmail.com','3',90,to_date('19 04 2019','DD MM YYYY')),
                        ('18','blackwidow@gmail.com','3',90,to_date('20 04 2019','DD MM YYYY')),
                        ('19','tyrion@gmail.com','2',100,to_date('17 04 2019','DD MM YYYY')),
                        ('20','tyrion@gmail.com','3',80,to_date('17 04 2019','DD MM YYYY')),
                        ('21','tyrion@gmail.com','4',110,to_date('18 04 2019','DD MM YYYY')),
                        ('22','tyrion@gmail.com','4',110,to_date('19 04 2019','DD MM YYYY'));

insert into provides values ('caroline@gmail.com','2'),
                            ('caroline@gmail.com','3'),
                            ('caroline@gmail.com','4'),
                            ('tarush@gmail.com','2'),
                            ('div@gmail.com','1'),
                            ('div@gmail.com','2'),
                            ('ben@gmail.com','3'),
                            ('mark@gmail.com','4'),
                            ('rob@gmail.com','4'),
                            ('rob@gmail.com','2'),
                            ('blackwidow@gmail.com','3'),
                            ('tyrion@gmail.com','3'),
                            ('tyrion@gmail.com','2'),
                            ('tyrion@gmail.com','4');

insert into cares values ('caroline@gmail.com','2',to_date('16 04 2019','DD MM YYYY'),'1','1','nathan@gmail.com',100,'Recommended'),
                         ('caroline@gmail.com','4',to_date('17 04 2019','DD MM YYYY'),'3','1','nathan@gmail.com',99,NULL),
                         ('tyrion@gmail.com','3',to_date('17 04 2019','DD MM YYYY'),'20','4','ed@gmail.com',90,'It was really nice. He is very professional does not drink on the job'),
                         ('ben@gmail.com','3',to_date('18 04 2019','DD MM YYYY'),'12','4','ed@gmail.com',80,NULL),
                         ('div@gmail.com','2',to_date('18 04 2019','DD MM YYYY'),'11','5','blackwidow@gmail.com',110,NULL),
                         ('div@gmail.com','1',to_date('17 04 2019','DD MM YYYY'),'10','6','blackwidow@gmail.com',100,'Nice'),
                         ('div@gmail.com','1',to_date('18 04 2019','DD MM YYYY'),'9','7','blackwidow@gmail.com',100,NULL);

insert into catservices values ('2'),
                               ('3'),
                               ('4');

insert into dogservices values ('1'),
                               ('2'),
                               ('4');

insert into bid values ('nathan@gmail.com','1',100,'1'),
                       ('nathan@gmail.com','3',95,'2'),
                       ('nathan@gmail.com','3',99,'1'),
                       ('nathan@gmail.com','11',100,'2'),
                       ('ed@gmail.com','20',90,'4'),
                       ('ed@gmail.com','12',80,'4'),
                       ('blackwidow@gmail.com','11',110,'5'),
                       ('blackwidow@gmail.com','10',100,'6'),
                       ('blackwidow@gmail.com','9',100,'7');

-- triggers
-- trigger 1 - bid must be higher than max bid

CREATE OR REPLACE FUNCTION min_bid()
RETURNS TRIGGER AS
$$
DECLARE  existence integer;
DECLARE maxPrice integer;
DECLARE bprice integer;
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
        select l1.baseprice from list l1 where NEW.listId=l1.listId into bprice;
        if NEW.price < bprice then
            return null;
        else
            return NEW;
        end if;
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


/*
BEGIN;Select *
    from petowned P
    natural join cat C where P.ownerId = 'tarush@gmail.com';
    Select *
    from petowned P
    natural join dog D where P.ownerId = 'tarush@gmail.com';
    Select U.name as Uname, S.name as Sname, CA.listId as lid, CA.price as price, CA.selected_date as date
    from (cares CA natural join services S ) inner join users U on U.userId  = CA.caretakerId
    where CA.ownerId ='tarush@gmail.com' and selected_date > to_date('4/12/2019','MM DD YYYY');Select U.name as Uname, S.name as Sname, CA.listId as lid, CA.price as price, CA.selected_date as date
    from (cares CA natural join services S ) inner join users U on U.userId  = CA.caretakerId
    where CA.ownerId ='tarush@gmail.com' and selected_date <= to_date('4/12/2019','MM DD YYYY');with
        listmax
        as
        (
            select max(B.price) as maxprice, L.available_dates as d,
                L.listid as listid, L.caretakerid as caretakerid, L.serviceId as serviceId
            from bid B left outer join list L on B.listid = L.listid
            group by L.listid
        ),
        ownermax
        as
        (
            select max(B.price) as myprice, B.ownerId as ownerId, B.listId as listid
            from bid B left outer join list L on B.listid = L.listid
            group by B.ownerId,B.listid
        ),
        withoutnames
        as
        (
            select *
            from ownermax O left outer join listmax L  using (listid)
            where O.myprice < L.maxprice
        )
    select W.listid, W.myprice, W.maxprice, U.name as uname, S.name as sname, W.d as d
    from (withoutnames W natural join services S ) inner join users U on U.userid = W.caretakerid
    where W.ownerId =  'tarush@gmail.com';
END;
/*