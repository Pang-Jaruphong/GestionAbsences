USE missclasse;

INSERT INTO projects (NAME, Name_groupe) VALUES
('Gestion des absences','truc machin'),
('Gestion des notes','cool');

INSERT INTO teachers (Lastname, firstname, email, acronyme) VALUES
('Coval', 'Victor', 'victor.coal@eduvaud.ch', 'VCL'),
('Benzonana', 'Pascal', 'pascal.benzonana@eduvaud.ch','PBA'),
('Favre', 'Raphäel', 'raphael.favre@eduvaud.ch', 'RFA'),
('Ithurbide', 'Julien', 'julien.ithurbide@eduvaud.ch', 'JIE');

INSERT INTO classes (Name_year, Salle, Teachers_id) VALUES
('SI-CA1a-2026', 'C331', 1),
('SI-CA2a-2026', 'C232', 2),
('SI-C1a-2026', 'C131', 3);

INSERT INTO hours (days, DATE, period, BEGIN, END) VALUES
('Lundi', '2026-01-12', '1', '08:15', '09:00'),
('Lundi', '2026-01-12', '2', '09:05', '09:50'),
('Lundi', '2026-01-12', '3', '10:05', '10:50'),
('Lundi', '2026-01-12', '4', '10:55', '11:40'),
('Lundi', '2026-01-12', '5', '11:45', '12:30'),
('Lundi', '2026-01-12', '6', '12:35', '13:20'),
('Lundi', '2026-01-12', '7', '13:20', '14:05'),
('Lundi', '2026-01-12', '8', '14:10', '14:55'),
('Lundi', '2026-01-12', '9', '15:05', '15:50'),
('Lundi', '2026-01-12', '10', '15:55', '16:40'),
('Mardi', '2026-01-13', '1', '08:15', '09:00'),
('Mardi', '2026-01-13', '2', '09:05', '09:50'),
('Mardi', '2026-01-13', '3', '10:05', '10:50'),
('Mardi', '2026-01-13', '4', '10:55', '11:40'),
('Mardi', '2026-01-13', '5', '11:45', '12:30'),
('Mardi', '2026-01-12', '6', '12:35', '13:20'),
('Mardi', '2026-01-13', '7', '13:20', '14:05'),
('Mardi', '2026-01-13', '8', '14:10', '14:55'),
('Mardi', '2026-01-13', '9', '15:05', '15:50'),
('Mardi', '2026-01-13', '10', '15:55', '16:40'),
('Mercredi', '2026-01-14', '1', '08:15', '09:00'),
('Mercredi', '2026-01-14', '2', '09:05', '09:50'),
('Mercredi', '2026-01-14', '3', '10:05', '10:50'),
('Mercredi', '2026-01-14', '4', '10:55', '11:40'),
('Mercredi', '2026-01-14', '5', '11:45', '12:30'),
('Mercredi', '2026-01-12', '6', '12:35', '13:20'),
('Mercredi', '2026-01-14', '7', '13:20', '14:05'),
('Mercredi', '2026-01-14', '8', '14:10', '14:55'),
('Mercredi', '2026-01-14', '9', '15:05', '15:50'),
('Mercredi', '2026-01-14', '10', '15:55', '16:40'),
('Jeudi', '2026-01-15', '1', '08:15', '09:00'),
('Jeudi', '2026-01-15', '2', '09:05', '09:50'),
('Jeudi', '2026-01-15', '3', '10:05', '10:50'),
('Jeudi', '2026-01-15', '4', '10:55', '11:40'),
('Jeudi', '2026-01-15', '5', '11:45', '12:30'),
('Jeudi', '2026-01-12', '6', '12:35', '13:20'),
('Jeudi', '2026-01-15', '7', '13:20', '14:05'),
('Jeudi', '2026-01-15', '8', '14:10', '14:55'),
('Jeudi', '2026-01-15', '9', '15:05', '15:50'),
('Jeudi', '2026-01-15', '10', '15:55', '16:40'),
('Vendredi', '2026-01-16', '1', '08:15', '09:00'),
('Vendredi', '2026-01-16', '2', '09:05', '09:50'),
('Vendredi', '2026-01-16', '3', '10:05', '10:50'),
('Vendredi', '2026-01-16', '4', '10:55', '11:40'),
('Vendredi', '2026-01-16', '5', '11:45', '12:30'),
('Vendredi', '2026-01-16', '6', '12:35', '13:20'),
('Vendredi', '2026-01-16', '7', '13:20', '14:05'),
('Vendredi', '2026-01-16', '8', '14:10', '14:55'),
('Vendredi', '2026-01-16', '9', '15:05', '15:50'),
('Vendredi', '2026-01-16', '10', '15:55', '16:40');


INSERT INTO projects_has_teachers (projects_id, teachers_id) VALUES
(1,1),
(2,1),
(1,3),
(2,4);

INSERT INTO classes_has_hours (Classes_id, Hours_id, Is_active) VALUES
(1,1,1),
(2,1,1),
(3,1,0),
(1,2,1),
(2,2,1);

INSERT INTO students (Lastname, firstname, email, phone, classes_id, projects_id) VALUES
('Ernst','Maxime','maxime.ernst@gmail.com','0771230212',1,1),
('Suljic','Eldan','eldan.suljic@gmail.com','0788865002',2,2),
('Yilmaz','Furkan','furkan.yilmaz@gmail.com','0765327532',3,1);

INSERT INTO absences (STATUS, JustifiedRuling, Pattern, Hours_id, students_id) VALUES
('Absent',0,'malade',1,1),
('Retard',1,'Beaucoup de trafic',2,2);
