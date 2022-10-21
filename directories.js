#!/usr/bin/node

let directories = [];

class CustomDirectory{
    constructor(directoryName, childDirectories = []) {
        this.directoryName = directoryName
        this.childDirectories = childDirectories
    }

    setChild(child) {
        this.childDirectories.push(child);
    }

    removeChild(child) {
        const index = this.childDirectories.findIndex(elem => elem.directoryName == child)
        let childObj = this.childDirectories[index];
        this.childDirectories.splice(index, 1);
        return childObj;

    }

    customPrint() {
        let output = this.directoryName
        if(this.childDirectories.length > 0) {
            this.childDirectories.forEach(elem => output += "\n\t" + elem.printChild(1))
        }
        console.log(output)
    }

    printChild(count) {
        let output = this.directoryName
        let tabs = "\t";
        let tempCount = count;
        while(tempCount > 0) {
            tabs += "\t";
            tempCount--;
        }
        if(this.childDirectories.length > 0) {
            this.childDirectories.forEach(elem => output += "\n" + tabs + elem.printChild(count + 1))
        }
        return output;
    }
}

class Dirs{
    run(input) {
        console.log(input)
        const inputArray = input.split(" ")
        if(inputArray[0] == "CREATE") {
            const directorySplit = inputArray[1].split("/")
            if(directorySplit.length == 1) {
                let current = new CustomDirectory(directorySplit[0], []);
                directories.push(current);
            } else {
                let current = new CustomDirectory(
                    directorySplit[directorySplit.length - 1],
                    [])
                let parentDir = directories.find(elem => elem.directoryName == directorySplit[0])
                let counter = 1
                while(directorySplit.length - 1 != counter) {
                    parentDir = parentDir.childDirectories.find(
                        elem => elem.directoryName == directorySplit[counter]);
                    counter += 1;
                }
                parentDir.setChild(current);
            }
        } else if(inputArray[0] == "LIST") {
            directories.sort((a, b) => {
                const nameA = a.directoryName.toUpperCase(); 
                const nameB = b.directoryName.toUpperCase(); 
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });
            directories.forEach(elem => elem.customPrint())
        } else if(inputArray[0] == "MOVE") {
            const directorySplit = inputArray[1].split("/")
            const index = directories.findIndex(elem => elem.directoryName == directorySplit[0])
            let current = directories[index]
            if(directorySplit.length - 1 > 0) {
                current = current.removeChild(directorySplit[directorySplit.length - 1])
            } else {
                directories.splice(index, 1)   
            }
            let parentDir = directories.find(elem => elem.directoryName == inputArray[2])
            parentDir.setChild(current)
            

        }
    }
}

let dirs = new Dirs;

dirs.run('CREATE fruits')
dirs.run('CREATE vegetables')
dirs.run('CREATE grains')
dirs.run('CREATE fruits/apples')
dirs.run('CREATE fruits/apples/fuji')
dirs.run('LIST')
dirs.run('CREATE grains/squash')
dirs.run('MOVE grains/squash vegetables')
dirs.run('CREATE foods')
dirs.run('MOVE grains foods')
dirs.run('MOVE fruits foods')
dirs.run('MOVE vegetables foods')
dirs.run('LIST')


