.. _Scenario-Check-Application-Health:

Check Application Health
========================

Check Application Health using CLI and Web Interface with application name.

.. image:: Check-Application-Health.png


**CLI**

This is an example of a command line interface for the user to interact with the system.


.. code-block:: none

  # c3 application check --name <string>
  # c3 application check --name myApp


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Check-Application-HealthWeb.png


**REST**

This is the definition of the RESTful interface for the system.

*application/check*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Application Name
============  ========  ===================
