db.getCollection("sites").aggregate(

    // Pipeline
    [
        // Stage 1
        {
            $match: {
                "siteList" : {
                    "$elemMatch" : {
                        "siteId" : 1
                    }
                }
            }
        },

        // Stage 2
        {
            $unwind: {
                "path": "$siteList"
            }
        },

        // Stage 3
        {
            $match: {
                "siteList.siteId": 1
            }
        },

        // Stage 4
        {
            $project: {
                "_id": 0
            }
        }
    ],

    // Options
    {

    }

    // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);