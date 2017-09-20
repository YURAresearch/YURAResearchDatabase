-- No filtering

SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite

FROM listings

ORDER BY  " + sortByParser(sortby) + "
          (SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),
          name,
          departments

/*
Ranking algorithm:
1. Sortby option if user selects
2. Check if entry is in favorites
5. Name and Department
*/


-- Just text search

SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite

FROM listings

WHERE to_tsvector(listings.name) @@ to_tsquery('"+searchHandler(searchString)+"')
   OR to_tsvector(listings.description) @@ to_tsquery('"+searchHandler(searchString)+"')
   OR to_tsvector(listings.keywords) @@ to_tsquery('"+searchHandler(searchString)+"')

ORDER BY " + sortByParser(sortby) + "
         (SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),
         (SELECT CASE WHEN (ts_rank(to_tsvector(listings.departments), to_tsquery('"+searchHandler(searchString)+"'))) > 0 THEN 1 ELSE 0 END) DESC,
         listings.custom_desc DESC,
         (SELECT ts_rank(to_tsvector(listings.name),to_tsquery('"+searchHandler(searchString)+"'))) DESC,
         (SELECT ts_rank(to_tsvector(listings.description),to_tsquery('"+searchHandler(searchString)+"'))) DESC,
         (SELECT ts_rank(to_tsvector(listings.keywords),to_tsquery('"+searchHandler(searchString)+"'))) DESC,
         name,
         departments

/*
Ranking algorithm:
1. Sortby option if user selects
2. Check if entry is in favorites
3. Check if dept matches searchString
4. Check if lab has sent custom desc to RDB
5. Rank entries based on closeness to search term (ts_rank)
   Order: Name, Description, Keywords
6. Name and Department
*/

-- Just Dept

SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite

FROM listings

WHERE LOWER(departments) LIKE LOWER('%" + deptString + "%')

ORDER BY  " + sortByParser(sortby) + "
         (SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),
         listings.custom_desc DESC,
         name,
         departments

/*
Ranking algorithm:
1. Sortby option if user selects
2. Check if entry is in favorites
3. Check if lab has sent custom desc to RDB
4. Name and Department
*/

-- Search and Dept:

SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite

FROM listings

WHERE LOWER(departments) LIKE LOWER('%" + deptString + "%') AND (to_tsvector(listings.name) @@ to_tsquery('"+searchHandler(searchString)+"')
                                                              OR to_tsvector(listings.description) @@ to_tsquery('"+searchHandler(searchString)+"')
                                                              OR to_tsvector(listings.keywords) @@ to_tsquery('"+searchHandler(searchString)+"'))

ORDER BY "+ sortByParser(sortby) + "
         (SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),
         (SELECT CASE WHEN (ts_rank(to_tsvector(listings.departments), to_tsquery('"+searchHandler(searchString)+"'))) > 0 THEN 1 ELSE 0 END) DESC,
         listings.custom_desc DESC,
         (SELECT ts_rank(to_tsvector(listings.name), to_tsquery('"+searchHandler(searchString)+"'))) DESC,
         (SELECT ts_rank(to_tsvector(listings.description), to_tsquery('"+searchHandler(searchString)+"'))) DESC,
         (SELECT ts_rank(to_tsvector(listings.keywords), to_tsquery('"+searchHandler(searchString)+"'))) DESC,
         name,
         departments

/*
Ranking algorithm:
1. Sortby option if user selects
2. Check if entry is in favorites
3. Check if dept matches searchString
4. Check if lab has sent custom desc to RDB
5. Rank entries based on closeness to search term (ts_rank)
   Order: Name, Description, Keywords
6. Name and Department
*/
