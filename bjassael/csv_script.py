import csv
import json
import random

f1 = open('foursquare_checkins.csv')
f2 = open('foursquare_friendship.csv')

csv1 = csv.reader(f1)

csv2 = csv.reader(f2)

n_friends = -1
n_user = []

for row in csv2:
    n_friends += 1

users = []
locations = []
csv_list = []
for row in csv1:
    locations.append(row[4])
    users.append(row[0])
    csv_list.append(row)


n_checkins = len(locations) - 1
n_users = len(set(users)) - 1
n_locations = len(set(locations)) - 1


m_friends = n_friends/n_users
m_locations = n_checkins / n_locations
m_checkins = n_checkins / len(set(users))

json_dict = {'checkins': n_checkins,
             'users': n_users,
             'locations': n_locations,
             'mean_locations': m_locations,
             'mean_checkins': m_checkins,
             'mean_friends': m_friends}

with open("test.json", "w") as outfile:
    json.dump(json_dict, outfile, indent=4)

random_sample = random.sample(csv_list, 500)

checkins = []
for row in random_sample:
    checkins.append({'user': row[0],
                     'latitude': row[1],
                     'longitude': row[2],
                     'time': row[3],
                     'location': row[4]})

json_dict_2 = {'checkins': checkins}

with open("test2.json", "w") as outfile:
    json.dump(json_dict_2, outfile, indent=4)
