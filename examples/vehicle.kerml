package VehicleExample {
    private import ScalarValues::*;

    doc /* The same model in KerML: classifiers, features,
           behaviors and connectors. */

    class Vehicle {
        feature mass : Real;
        composite feature wheels : Wheel[4] ordered;
        composite feature engine : Engine;
        step drive : Drive;
    }

    class Wheel;
    class Engine { feature fuelIn : FuelPort; }
    struct FuelPort { in feature fuel : Fuel; }
    datatype Fuel;

    behavior Drive {
        in speed : Real;
        step accelerate : Accelerate { in s = speed; }
        succession accelerate then cruise;
        step cruise : Cruise;
    }

    function Add { in x : Real; in y : Real; return : Real = x + y; }
    predicate Heavy { in v : Vehicle; v.mass > 1000.0 }

    feature vehicle : Vehicle {
        feature :>> mass = 1200.0;
        connector fuel from engine.fuelIn to fuelPort;
    }

    inv massLimit { vehicle.mass <= 1500.0 }
}
