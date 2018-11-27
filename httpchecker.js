/*
    Checks a web page for insecure content.  This will check outgoing links also
    not just insecure images so outgoing links will appear as false positives.

    2018  Scott Wren
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const request = require('request');
const stringSearcher = require('string-search');
const colors = require('colors/safe');

class Httpchecker {
    constructor(source, strToSearch, verbose=false) {
        this.source = source;
        this.strToSearch = strToSearch;
        this.verbose = verbose;
        this.strToCompare = 'http://';
    }

    http() {
        request(this.source, (err, res, body) => {
            if(err) {
                console.log(err);
                return;
            }
    
            if(res.statusCode == 200){ //OK
                let str = body;
                stringSearcher.find(body, this.strToCompare)
                .then((resultArr) => {

                    if(!resultArr.length)
                        console.log(colors.green(`SECURE: ${this.source} is secure.`));

                    resultArr.forEach((element) => {
                        if(!this.verbose) {
                            console.log(colors.red(`Non SSL at line: ${element.line} ${element.term}`));
                        }
                        else {
                            console.log(colors.red(`Non SSL at line: ${element.line} ${element.term}`));
                            console.log(`${element.text}`);
                            console.log();
                        }
                    });
                });
            } else {
                console.log(`Error establishing a connection: ${res.statusCode}`);
            }
        });
    }
}

module.exports = Httpchecker;