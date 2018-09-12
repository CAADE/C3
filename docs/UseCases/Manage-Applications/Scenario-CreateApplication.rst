.. _Scenario-Create-Application:

Create Application
==================

Application Develop interacts with the Application manager to create an Application.
A json or yaml representation of the application is downloaded to the working directory
of the project for the application.

.. image:: CreateApplication.png

**User**

* :ref:`Actor-Application-Developer`

**Systems**

* :ref:`Subsystem-Application-Manager`

**Command Line Interface**

Create a new application from the selected stack

.. code-block:: none

  # c3 app create <Application Name> --stack <Application Stack>
