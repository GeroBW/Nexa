-- SQLite
-- SQLite
WITH
    result1
    AS
    (
        SELECT *
        FROM product
            INNER JOIN size on product.id = size.product_id
            INNER JOIN sizeparameter on size.id = sizeparameter.size_id
        WHERE parameter_value IS NOT NULL
    )
SELECT * FROM result1;
-- SELECT id, size_label, parameter_name, parameter_value, url FROM result1
-- WHERE size_label = 'M' 
-- AND parameter_name = 'Oberweite'