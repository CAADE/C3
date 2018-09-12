.. _Scenario-Select-Environment:

Select Environment
====================
Select Environment using CLI and Web Interface with ... <parameters>

.. image:: Select-Environment.png


**CLI**

This is an example of a command line interface for the user to interact with the system.

.. code-block:: none

  # c3 env select --name <string>
  # c3 env select --name dev


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Select-EnvironmentWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*env/select*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the environment to use.
============  ========  ===================
