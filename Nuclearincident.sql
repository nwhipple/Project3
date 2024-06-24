DROP TABLE IF EXISTS nuclearincidents; 
CREATE TABLE nuclearincidents (
    incident_year INT,
    incident VARCHAR(30),
    ines_level FLOAT,
    country VARCHAR(20),
    IAEA_description VARCHAR(500),
    latitude FLOAT,
    longitude FLOAT
);

SELECT * FROM nuclearincidents