from rest_framework.views import APIView
from rest_framework.response import Response
import sqlite3

class GetData(APIView):
    def get(self, request):

        database_name = 'login.sqlite3'


        conn = sqlite3.connect(database_name)
        cursor = conn.cursor()


        cursor.execute("SELECT fullname, username, password, street, city, postcode, email, "
                       "school_name, school_start_year, school_end_year, "
                       "college_name, college_start_year, college_end_year, "
                       "university_name, university_start_year, university_end_year "
                       "FROM users")


        result = cursor.fetchall()


        response_data = []
        for row in result:
            fullname, username, password, street, city, postcode, email, school_name, school_start_year, school_end_year, college_name, college_start_year, college_end_year, university_name, university_start_year, university_end_year = row
            transformed_record = {
                'fullname': fullname,
                'username': username,
                'password': password,
                'address': f"{postcode}, {city}, ул. {street}",
                'email': email,
                'school': {
                    'name': school_name,
                    'start_year': school_start_year,
                    'end_year': school_end_year
                },
                'college': {
                    'name': college_name,
                    'start_year': college_start_year,
                    'end_year': college_end_year
                },
                'university': {
                    'name': university_name,
                    'start_year': university_start_year,
                    'end_year': university_end_year
                }
            }
            response_data.append(transformed_record)


        conn.close()


        return Response(response_data)
