import json
import csv
from datetime import timedelta, date
from random import randint


def random_date(start, end):
    return start + timedelta(days=randint(0, (end-start).days))


def rand_around(fecha):
    return fecha + timedelta(days=randint(-7, 7))


def expedicion_dic(expedicion, cumbre, andinista, fecha):
    return {
        'Expedicion': expedicion['numero'],
        'Andinista': andinista['numero'],
        'Pais': andinista['pais'],
        'Cumbre': cumbre['nombre'],
        'Latitud': cumbre['lat'],
        'Longitud': cumbre['lon'],
        'Fecha': fecha
        }

if __name__ == "__main__":
    json_data = open("tarea1.json").read()
    data = json.loads(json_data)

    with open('tarea1.csv', 'w', encoding='utf-8', newline='') as csvfile:
        atrs = ['Expedicion', 'Andinista', 'Pais', 'Cumbre', "Latitud",
                "Longitud", "Fecha"]
        writer = csv.DictWriter(csvfile, fieldnames=atrs)
        writer.writeheader()
        for expedicion in data["expediciones"]:
            fecha = random_date(date(2014, 1, 1), date.today())
            for cumbre in expedicion["cumbres"]:
                fecha = rand_around(fecha)
                for andinista in expedicion['andinistas']:
                    writer.writerow(expedicion_dic(expedicion, cumbre,
                                    andinista, str(fecha)))
