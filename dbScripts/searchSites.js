db.getCollection("sites").aggregate(

    // Pipeline
    [
        // Stage 1
        {
            $match: {
                "siteList" : {
                    "$elemMatch" : {
                        "siteName" : /Fur/
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
                "siteList.siteName": /Fur/
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