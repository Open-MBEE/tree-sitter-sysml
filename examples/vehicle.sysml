package VehicleExample {
    private import ScalarValues::*;
    private import ISQ::*;
    private import SI::*;

    doc /* A small vehicle model exercising definitions, usages,
           connections, actions and states. */

    part def Vehicle {
        attribute mass : MassValue;
        part wheels : Wheel[4] ordered;
        part engine : Engine;
        port fuelPort : FuelPort;

        perform action drive : Drive;
        exhibit state vehicleStates : VehicleStates;
    }

    part def Wheel;
    part def Engine { port fuelIn : ~FuelPort; }
    port def FuelPort { in item fuel : Fuel; }
    item def Fuel;

    action def Drive {
        in speed : Real;
        first start;
        then action accelerate { in s = speed; }
        then action cruise;
        if speed > 100 [km / h] { action warn; }
        then done;
    }

    state def VehicleStates {
        entry; then off;
        state off;
        state on { do action running; }
        transition off_to_on
            first off
            accept ignition : IgnitionSignal
            then on;
        transition on then off;
    }

    part vehicle : Vehicle {
        attribute redefines mass = 1200 [kg];
        connect engine.fuelIn to fuelPort;
    }

    requirement def MassLimit {
        subject vehicle : Vehicle;
        attribute maxMass : MassValue = 1500 [kg];
        require constraint { vehicle.mass <= maxMass }
    }

    satisfy MassLimit by vehicle;
}
