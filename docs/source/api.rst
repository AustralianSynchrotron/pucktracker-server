HTTP API
========

The Puck Tracker database can be updated by posting JSON payloads to a HTTP endpoint. For
example, with curl::

  curl -X POST http://example.com/actions \
       -H Content-Type:application/json \
       --data '{"type": "ADD_PUCK", "puck": {"name": "ASP1234"}}'


or with `HTTPie <https://httpie.org/>`_::

  http http://example.com/actions type=ADD_PUCK puck:='{"name": "ASP1234"}'


or with Python::

  import requests
  requests.post('http://example.com/actions',
                json={'type': 'ADD_PUCK', 'puck': {'name': 'ASP1234'}})


The full list of actions that can be submitted are below.

Dewars
------

ADD_DEWAR
~~~~~~~~~

::

  {
    "type": "ADD_DEWAR",
    "dewar": {
      "name": string,
      "epn": string (optional),
      "owner": string (optional),
      "containerType": "pucks" | "cassettes" | "canes" (optional),
      "onsite": boolean (optional),
      "arrivedTime": iso8601 (optional),
      "department": string (optional),
      "streetAddress": string (optional),
      "city": string (optional),
      "state": string (optional),
      "postcode": string (optional),
      "country": string (optional),
      "phone": string (optional),
      "email": string (optional),
      "courier": string (optional),
      "courierAccount": string (optional),
      "returnDewar": boolean (optional)
    }
  }


DELETE_DEWAR
~~~~~~~~~~~~

::

  {
    "type": "DELETE_DEWAR",
    "dewar": string: dewar-name
  }


UPDATE_DEWAR
~~~~~~~~~~~~

::

  {
    "type": "UPDATE_DEWAR",
    "dewar": string: dewar-name,
    "update": {
      "epn": string (optional),
      "owner": string (optional),
      "containerType": "pucks" | "cassettes" | "canes" (optional),
      "onsite": boolean (optional),
      "arrivedTime": iso8601 (optional),
      "department": string (optional),
      "streetAddress": string (optional),
      "city": string (optional),
      "state": string (optional),
      "postcode": string (optional),
      "country": string (optional),
      "phone": string (optional),
      "email": string (optional),
      "courier": string (optional),
      "courierAccount": string (optional),
      "returnDewar": boolean (optional)
    }
  }


SET_DEWAR_OFFSITE
~~~~~~~~~~~~~~~~~

::

  {
    "type": "SET_DEWAR_OFFSITE",
    "dewar": string: dewar-name
  }



DEWAR_FILLED
~~~~~~~~~~~~

::

  {
    "type": "DEWAR_FILLED",
    "dewar": string: dewar-name,
    "time": iso8601 (optional)
  }


Adaptors
--------

ADD_ADAPTOR
~~~~~~~~~~~

::

  {
    "type": "ADD_ADAPTOR",
    "adaptor": {
      "name": string,
      "location": string (optional),
      "position": string (optional)
    }
  }

DELETE_ADAPTOR
~~~~~~~~~~~~~~

::

  {
    "type": "DELETE_ADAPTOR",
    "adaptor": string: adaptor-name
  }

SET_ADAPTOR_PLACE
~~~~~~~~~~~~~~~~~

::

  {
    "type": "SET_ADAPTOR_PLACE",
    "adaptor": string: adaptor-name,
    "location": string: dewar-name | null,
    "position": string: dewar-location | null
  }

Pucks
------

ADD_PUCK
~~~~~~~~

::

  {
    "type": "ADD_PUCK",
    "puck": {
       "name": string,
       "receptacleType": string (optional),
       "receptacle": string (optional),
       "slot": string (optional),
       "lastDewar": string (optional),
       "note": string (optional),
       "owner": string (optional),
       "institute": string (optional),
       "email": string (optional)
    }
  }

DELETE_PUCK
~~~~~~~~~~~

::

  {
    "type": "DELETE_PUCK",
    "puck": string: puck-name
  }

SET_PUCK_RECEPTACLE
~~~~~~~~~~~~~~~~~~~

::

  {
    "type": "SET_PUCK_RECEPTACLE",
    "puck": string: puck-name,
    "receptacleType": "dewar" | "adaptor" | null,
    "receptacle": string | null: dewar-name/adaptor-name,
    "slot": "A" | "B" | "C" | "D" | null
  }

UPDATE_PUCK
~~~~~~~~~~~
::

  {
    "type": "UPDATE_PUCK",
    "puck": string: puck-name,
    "update": {
       "receptacleType": string (optional),
       "receptacle": string (optional),
       "slot": string (optional),
       "lastDewar": string (optional),
       "note": string (optional),
       "owner": string (optional),
       "institute": string (optional),
       "email": string (optional)
    }
  }

CLEAR_PUCKS_FOR_RECEPTACLE
~~~~~~~~~~~~~~~~~~~~~~~~~~
::

  {
    "type": "CLEAR_PUCKS_FOR_RECEPTACLE",
    "receptacle": string: dewar-name/adaptor-name,
    "receptacleType": "dewar" | "adaptor"
  }

Ports
------

SET_PORT_STATE
~~~~~~~~~~~~~~

::

  {
    "type": "SET_PORT_STATE",
    "container": string: puck-name,
    "number": integer: port-number,
    "state": "full" | "empty" | "unknown"
  }


SET_MULTIPLE_PORT_STATES
~~~~~~~~~~~~~~~~~~~~~~~~

::

  {
    "type": "SET_MULTIPLE_PORT_STATES",
    "container": string: puck-name,
    "numbers": [ number: port-number, ... ],
    "state": "full" | "empty" | "unknown"
  }
