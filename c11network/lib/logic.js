const namespace = 'org.example.smint';


/**
 * Creates a trip.
 * @param {org.example.smint.CreateTrip} createtrip(fromLocation,toLocation,fromDatetime,toDatetime,transporter)
 * @transaction
 */
async function createTrip(createtrip)
{
    const fromLocation = createtrip.fromLocation;
    const toLocation = createtrip.toLocation;
  	const fromDatetime = createtrip.fromDatetime;
    const toDatetime = createtrip.toDatetime;
    const tripId = createtrip.tripId;
    const transporter = createtrip.transporter;

    const factory = getFactory();
    const tripRegistry = await getAssetRegistry(namespace + '.Trip');
    var trip = factory.newResource(namespace, 'Trip', tripId);
    trip.fromLocation = fromLocation;
    trip.toLocation = toLocation;
    trip.fromDatetime = fromDatetime;
    trip.toDatetime = toDatetime;
    trip.status = 'INTRANSIT';
    trip.transporter = transporter;

    if (transporter)
    {
        const transporterRegistry = await getParticipantRegistry(namespace + '.Transporter');
        if (!transporter.trips)
            transporter.trips = [];
        transporter.trips.push(trip);
        await transporterRegistry.update(transporter);
    }
    await tripRegistry.add(trip);
}

async function signTrip(signtrip)
{
    var trip = signtrip.trip;

    //const certificateId = signtrip.certificateId;
    const tripRegistry = await getAssetRegistry(namespace + '.Trip');

    //var tripCertificate = factory.newResource(namespace, 'TripCertificate', certificateId);
    trip.status = 'SIGNED'; 
    await tripRegistry.update(trip);
}

/**
 * Creates a trip.
 * @param {org.example.smint.AddCargo} addCargo(trip,cargo)
 * @transaction
 */
async function addCargo(addcargo)
{
    const trip = addcargo.trip;
    const cargo = addcargo.cargo;
    
    tripRegistry = await getAssetRegistry(namespace + '.Trip');
  	if (!trip.cargoes)
    {
    	trip.cargoes = [];
    }
    trip.cargoes.push(cargo);
    await tripRegistry.update(trip);
}

/**
 * Creates a trip.
 * @param {org.example.smint.RemoveCargo} removecargo(trip, cargo)
 * @transaction
 */
async function removeCargo(removecargo)
{
    const trip = removecargo.trip;
    const cargo = removecargo.cargo;


    tripRegistry = await getAssetRegistry(namespace + '.Trip');
    // TODO: Check empty array...
    for (i = 0; i < trip.cargoes.length; i++)
    {
        if (trip.cargoes[i].cargoId = cargo.Id)
            trip.cargoes.splice(i, 1);
    }
    await tripRegistry.update(trip);
}