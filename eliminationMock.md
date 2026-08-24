Q. “What if there are 50 million documents how'd you optimise it ?”

A. it is indexing + early filtering + reducing intermediate documents. 

   I would create an index on the field used by $match.
   
   If the query also filters something like status:
   {
   $match: {
    status: "PAID",
    createdAt: {
      $gte: startDate,
      $lt: endDate
    }
  }
}

I would consider a compound index such as:

db.orders.createIndex({
  status: 1,
  createdAt: 1
});

now the question comes that when to use compound index --> You should use a compound index when your application frequently runs complex queries that filter or sort by multiple fields at the same time, queries which regularly use two or more fields



