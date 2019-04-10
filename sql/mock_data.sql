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

insert into cares values ('','','','',,to_date(),'');

insert into athome values ('2'),
                          ('3'),
                          ('4');

insert into notathome values ('1');

insert into bid values ('nathan@gmail.com','1',100,'1'),
                       ('nathan@gmail.com','3',95,'2'),
                       ('nathan@gmail.com','3',99,'1'),
                       ('nathan@gmail.com','11',100,'2'),
                       ('ed@gmail.com','20',90,'4'),
                       ('ed@gmail.com','12',80,'4'),
                       ('blackwidow@gmail.com','11',110,'5'),
                       ('blackwidow@gmail.com','10',100,'6'),
                       ('blackwidow@gmail.com','9',100,'7');
