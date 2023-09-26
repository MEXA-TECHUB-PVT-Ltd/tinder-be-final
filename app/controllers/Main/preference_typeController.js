

const {pool} = require("../../config/db.config");

// THIS API IS FOR ADDING A PREFRENCE TYPE
exports.addpreference_type = async (req, res) => {
    const client = await pool.connect();
    try {
        const preference_type = req.body.preference_type;

        const query = 'INSERT INTO preference_types (preference_type) VALUES ($1) RETURNING*'
        const result = await pool.query(query , 
            [
                preference_type ? preference_type : null,
              
            ]);

        if (result.rows[0]) {
            res.status(201).json({
                message: "preference_type saved in database",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not save",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.messagefalse
        })
    }
    finally {
        client.release();
      }

}

// THIS API IS FOR UPDATING A PREFRENCE TYPE
exports.updatepreference_type = async (req, res) => {
    const client = await pool.connect();
    try {
        const preference_type_id = req.body.preference_type_id;
        const preference_type = req.body.preference_type;



        if (!preference_type_id) {
            return (
                res.json({
                    message: "Please provide preference_type_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE preference_types SET ';
        let index = 2;
        let values =[preference_type_id];

        
        if(preference_type){
            query+= `preference_type = $${index} , `;
            values.push(preference_type)
            index ++
        }
      

        query += 'WHERE preference_type_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");

       const result = await pool.query(query , values);

        if (result.rows[0]) {
            res.json({
                message: "Updated",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not update . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

// THIS API IS FOR DELETING A PREFRENCE TYPE
exports.deletepreference_type = async (req, res) => {
    const client = await pool.connect();
    try {
        const preference_type_id = req.query.preference_type_id;
        if (!preference_type_id) {
            return (
                res.json({
                    message: "Please provide preference_type_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM preference_types WHERE preference_type_id = $1 RETURNING *';
        const result = await pool.query(query , [preference_type_id]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not delete . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

// THIS API IS FOR GETTING ALL PREFRENCE TYPE
exports.getAllpreference_types = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM preference_types WHERE trash=$1'
            result = await pool.query(query , [false]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM preference_types WHERE trash=$3 LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset , false]);

      
        }
       
        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                count : result.rows.length,
                result: result.rows
            })
        }
        else {
            res.json({
                message: "could not fetch",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }

}

// THIS API IS FOR GETTING SPECIFIC PREFRENCE TYPE
exports.getpreference_typeById= async (req, res) => {
    const client = await pool.connect();
    try {
        const preference_type_id = req.query.preference_type_id;
        if (!preference_type_id) {
            return (
                res.status(400).json({
                    message: "Please Provide preference_type_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM preference_types WHERE preference_type_id = $1'
        const result = await pool.query(query , [preference_type_id]);

        if (result.rowCount>0) {
            res.json({
                message: "Fetched",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "could not fetch",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }

}
