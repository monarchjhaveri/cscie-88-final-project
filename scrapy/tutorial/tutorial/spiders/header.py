import fileinput
for line in fileinput.input('result.csv', inplace=True):
    if fileinput.isfirstline():
        print('name:string:users,name:string:users,type,since,counter:int')
    else:
        print(line)

