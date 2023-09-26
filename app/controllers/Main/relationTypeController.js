

const {pool} = require("../../config/db.config");

// ADD RELATION TYPE
exports.addRelation_type= async (req, res) => {
    const client = await pool.connect();
    try {
        const type = req.body.type;

        const query = 'INSERT INTO relation_type (type) VALUES ($1) RETURNING*'
        const result = await pool.query(query , 
            [
                type ? type : null,
              
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "relation_type saved in database",
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

// UPDATE RELATION TYPE
exports.updateRelation_type = async (req, res) => {
    const client = await pool.connect();
    try {
        const relation_type_id = req.body.relation_type_id;
        const type = req.body.type;



        if (!type) {
            return (
                res.json({
                    message: "Please provide type ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE relation_type SET ';
        let index = 2;
        let values =[relation_type_id];

        
        if(type){
            query+= `type = $${index} , `;
            values.push(type)
            index ++
        }
      

        query += 'WHERE relation_type_id = $1 RETURNING*'
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

// DELETE RELATION TYPE
exports.deleteRelation_type = async (req, res) => {
    const client = await pool.connect();
    try {
        const relation_type_id = req.query.relation_type_id;
       
        if (!relation_type_id) {
            return (
                res.json({
                    message: "Please provide relation_type_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM relation_type WHERE relation_type_id = $1 RETURNING *';
        const result = await pool.query(query , [relation_type_id]);

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

// GET ALL RELATION TYPE
exports.getAllrelation_types = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM relation_type'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM relation_type LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset]);

      
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

// GET SPECIFIC RELATION TYPE
exports.getRelation_typeById= async (req, res) => {
    const client = await pool.connect();
    try {
        const relation_type_id = req.query.relation_type_id;

        if (!relation_type_id) {
            return (
                res.status(400).json({
                    message: "Please Provide relation_type_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM relation_type WHERE relation_type_id = $1'
        const result = await pool.query(query , [relation_type_id]);

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

// SEARCH RELATION TYPE
exports.searchrelation_type= async (req, res) => {
    const client = await pool.connect();
    try {
        let type = req.query.type;

        if(!type){
            return(
                res.json({
                    message: "type must be provided",
                    status : false
                })
            )
        }

        const query = `SELECT * FROM relation_type WHERE type ILIKE $1`;
        let result = await pool.query(query , [type.concat("%")]);

        if(result.rows){
            result = result.rows
        }
       
        if (result) {
            res.json({
                message: "Fetched",
                status: true,
                result : result
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