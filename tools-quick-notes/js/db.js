var db = {
	open: function() {
		var database = openDatabase('noteapp', '', 'Note by Diigo', 5*1024*1024, db.notes);
		db.open = function() { return database; };
		return database;
	},
	
	notes: function() {
		db.tx({name: 'create_notes'}, function(tx, ds) {
			tx.executeSql(
				'CREATE TRIGGER update_modified_time AFTER UPDATE ' 
				+'OF title, desc ON notes ' 
				+'BEGIN ' 
				+	'UPDATE notes SET updated = DATETIME() WHERE id=OLD.id; ' 
				+'END;'
			);
		});
	},
	kw: function(){
		db.tx({name:'create_kw'},function(tx,ds){});
	},
	diigo: function() {
		db.tx({name: 'create_diigo'}, function(tx, ds) {
			// copy existed notes' id to diigo's local_id
			/* tx.executeSql('SELECT notes.id FROM notes, diigo WHERE notes.id<>diigo.local_id', [], function(tx, ds) {
				console.log(ds);
				for (var i = 0, len = ds.rows.length; i<len; ++i) {
					tx.executeSql('INSERT INTO diigo (local_id) VALUES (?);', [ds.rows.item(i).id]);
				}
			});  */
			tx.executeSql('SELECT * FROM notes', [], function(tx, ds) {
				console.log(ds);
				var item;
				for (var i = 0, len = ds.rows.length; i<len; ++i) {
					item = ds.rows.item(i);
					tx.executeSql(
						'INSERT INTO diigo (local_id, server_created_at, server_updated_at) VALUES (?, ?, ?);', 
						[item.id, item.created, item.updated]
					);
				}
			});
			
			// trigger for diigo, listen notes INSERT
			tx.executeSql(
				'CREATE TRIGGER IF NOT EXISTS diigo_insert AFTER INSERT ON notes ' 
				+'BEGIN ' 
				+	'INSERT INTO diigo (local_id, server_created_at, server_updated_at) '
				+	'VALUES (NEW.id, NEW.created, NEW.updated); '
				+'END;'
			); 
			
			// trigger for diigo, listen notes DELETE
			tx.executeSql(
				'CREATE TRIGGER IF NOT EXISTS diigo_delete AFTER DELETE ON notes ' 
				+'BEGIN ' 
				+	'DELETE FROM diigo WHERE local_id = OLD.id; ' 
				+'END;'
			);
			
			// trigger for diigo, listen notes UPDATE
			/* tx.executeSql(
				'CREATE TRIGGER IF NOT EXISTS diigo_update '
				+'AFTER UPDATE OF list ON notes ' 
				+'BEGIN ' 
				+	'UPDATE diigo SET server_id=-1, server_created_at=NEW.updated, '
				+	'server_updated_at=NEW.updated WHERE local_id=OLD.id AND OLD.list="trash"; '
				+'END;'
			);   */
			
			db.upgrade(tx);
		});
	},
	
	google: function(callback) {
		db.tx({name: 'create_google'}, function(tx, ds) {
			// copy existed notes' id into google's local_id
			tx.executeSql('SELECT id FROM notes', [], function(tx, ds) {
				for (var i = 0, len = ds.rows.length; i<len; ++i) {
					tx.executeSql('INSERT INTO google (local_id) VALUES (?);', [ds.rows.item(i).id]);
				}
			});
			
			// trigger for google, listen notes INSERT
			tx.executeSql(
				'CREATE TRIGGER IF NOT EXISTS google_insert AFTER INSERT ON notes ' 
				+'BEGIN ' 
				+	'INSERT INTO google (local_id) VALUES (NEW.id); '
				+'END;'
			);
			
			// trigger for google, listen notes DELETE
			tx.executeSql(
				'CREATE TRIGGER IF NOT EXISTS google_delete AFTER DELETE ON notes ' 
				+'BEGIN ' 
				+	'DELETE FROM google WHERE local_id = OLD.id; ' 
				+'END;'
			);
			
			// trigger for google, listen notes UPDATE
			
			db.upgrade(tx);
			callback();
		});
	},
	
	// upgrade db scheme, but not actually change its version
	upgrade: function(tx) {
		// 2010-12-15 19:36:40 - mo
		// db scheme version: '' -> 1.1 (not change per se)
		// 1. delete update_modified_time trigger
		//    (we need a trigger which triggers whenever a col changed)
		// 2. create a new trigger does that
		tx.executeSql('DROP TRIGGER IF EXISTS update_modified_time');
		tx.executeSql(
			'CREATE TRIGGER IF NOT EXISTS notes_updated AFTER UPDATE '
			+'OF title, desc, url, list, tag ON notes ' 
			+'BEGIN ' 
			+	'UPDATE notes SET updated = DATETIME() WHERE '
			+	'id=OLD.id AND (OLD.title<>NEW.title OR OLD.desc<>NEW.desc '
			+	'OR OLD.url<>NEW.url OR OLD.list<>NEW.list OR OLD.tag<>NEW.tag); ' 
			+'END;'
		);
	},
	
	tx: function(r, callback) {
		var query, row;
		switch(r.name) {
		case 'create_notes':
			query = 'CREATE TABLE IF NOT EXISTS notes ('
						+	'id INTEGER PRIMARY KEY,'
						+	'title TEXT NOT NULL,'
						+	'desc TEXT,'
						+	'url TEXT,'
						+	'list TEXT,'
						+	'tag TEXT,'
						+	'updated DATETIME DEFAULT CURRENT_TIMESTAMP,'
						+	'created DATETIME DEFAULT CURRENT_TIMESTAMP);';
			row = [];
			break;
		case 'create_diigo':
			query = 'CREATE TABLE IF NOT EXISTS diigo ('
						+	'id INTEGER PRIMARY KEY,'
						+	'local_id INTEGER,'
						+	'server_id INTEGER DEFAULT -1,'
						+	'server_created_at DATETIME DEFAULT -1,'
						+	'server_updated_at DATETIME DEFAULT -1,'
						+ 'user_id INTEGER DEFAULT -1,'
						+ 'mode TEXT DEFAULT 2,'
						+	'FOREIGN KEY(local_id) REFERENCES notes(id));';
			row = [];
			break;
		case 'create_google':
			query = 'CREATE TABLE IF NOT EXISTS google ('
						+	'id INTEGER PRIMARY KEY,'
						+	'local_id INTEGER,'
						+	'docid TEXT DEFAULT -1,' // server_id
						+ 'etag TEXT,'
						+	'FOREIGN KEY(local_id) REFERENCES notes(id));';
			row = [];
			break;
		case 'create_kw':
			query = 'CREATE TABLE IF NOT EXISTS kw ('
						+	'id INTEGER PRIMARY KEY,'
						+	'kw TEXT)';
			row = [];
			break;
		case 'add_kw':
			query = 'INSERT INTO kw (kw) VALUES (?);';
			row = [r.kw];
			break;
		case 'delete_kw':
			query = 'DELETE FROM kw WHERE kw=?';
			row = [r.kw];
			break
		case 'select_kw_new_10':
			query = 'SELECT * FROM kw ORDER BY id desc limit 10';
			row = [];
			break;
		case 'add':
			query = 'INSERT INTO notes (title, desc, url, list, tag) VALUES (?, ?, ?, ?, ?);';
			row = ['', '', r.from=='app' ? '' : tab.url, '', ''];
			break;
		case 'save_note':
			query = 'UPDATE notes SET title=?, desc=?, url=?, list=?, tag=? WHERE id=?';
			row = [r.title, r.desc, r.url, r.list, r.tag, r.id];
			break;
		case 'empty_trash':
			query = 'DELETE FROM notes WHERE list=?';
			row = ['trash'];
			break; 
		case 'clean':
			query = 'DELETE FROM notes WHERE list=? AND title=? AND desc=?';
			row = ['trash', '', ''];
			break;
		case 'clean_empty_data':
			query = 'DELETE FROM notes WHERE title=? AND desc=?';
			row = ['', ''];
			break;
		case 'url':
			query = 'UPDATE notes SET '+r.name+'=? WHERE id=?';
			row = [r.data ? tab.url : '', r.id];
			break;
		case 'check_url':
			query = 'SELECT * FROM notes WHERE url=? AND list<>?';
			row = [r.url, 'trash'];
			break;
		case 'load_titles':
			console.log(localStorage['service']);
			if (localStorage['service'] === 'diigo') {
				query = 'SELECT notes.id, notes.title, notes.updated FROM notes, diigo '
					+	'WHERE notes.list=? AND (notes.title<>? OR notes.desc<>?) '
					+ 'AND diigo.local_id=notes.id AND diigo.user_id=? '
					+ 'ORDER BY notes.updated';
//					+'ORDER BY diigo.server_created_at';
				row = [r.list, '', '', JSON.parse(localStorage['diigo']).user_id];
			}
			else {
				query = 'SELECT notes.id, notes.title, notes.updated FROM notes, diigo '
					+	'WHERE notes.list=? AND (notes.title<>? OR notes.desc<>?) '
					+	'AND diigo.local_id=notes.id ORDER BY notes.updated';
				row = [r.list, '', ''];
			}
			break;
		case 'load_note':
			query = 'SELECT * FROM notes WHERE id=?';
			row = [r.id];
			break;
		case 'search':
			var s = r.terms;
			query = 'SELECT id FROM notes WHERE list=? AND (title LIKE ? OR desc LIKE ?)';
			row = [r.list, s, s];
			break;
			
		case 'add_item_from_server':
			// 2010-12-13 17:12:14 - mo
			// we only record created time from server or other client 
			// updated is client generated and overrides server unidirectionally
			query = 'INSERT INTO notes (title, desc, tag, created) VALUES (?, ?, ?, ?);';
			row = [r.title, r.content, r.tags, r.created];
			break;
		case 'update_server_id':
			query = 'UPDATE diigo SET server_id=? WHERE local_id=?'
			row = [r.server_id, r.local_id];
			break;
		case 'update_item':
			query = 'UPDATE notes SET title=?, desc=?, tag=? WHERE id=?';
			row = [r.title, r.content, r.tags, r.local_id];
			break;
			
		case 'upload_items':

			query = 'SELECT * FROM notes, diigo '
				+ 'WHERE updated>? AND notes.id = diigo.local_id '
				+ 'AND (diigo.user_id=? OR diigo.user_id=-1)';
			row = [localStorage['diigo_upload_stamp'], 
				JSON.parse(localStorage['diigo']).user_id];
			break;
		case 'sync_items':
			query = 'SELECT notes.id, list, server_id, mode FROM notes, diigo '
				+ 'WHERE notes.id = diigo.local_id '
				+ 'AND (diigo.user_id=? OR diigo.user_id=-1)';
			row = [JSON.parse(localStorage['diigo']).user_id];
			break;
			
		// write query inplace not in db.js
		case 'transaction':
			query = r.query;
			row = r.row;
			break;
		default:
			// FIXME: every this kind of query should prefix its r.name with 'update_' for clarity
			query = 'UPDATE notes SET ' + r.name.replace('update_', '') + '=? WHERE id=?';
			row = [r.data, r.id];
		}
		
		db.open().transaction(
			function(tx) {
				tx.executeSql(query, row, callback);
			},
			util.error
		);
	}
};
