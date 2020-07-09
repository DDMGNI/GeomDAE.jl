
using GeometricIntegrators.Common
using GeometricIntegrators.Config
using GeometricIntegrators.Integrators
using GeometricIntegrators.Tableaus
using GeometricProblems.LotkaVolterra2d
using Test

<<<<<<< HEAD
using GeometricIntegrators.Equations: _get_v̄, _get_f̄
=======
using GeometricIntegrators.Equations: _get_v, _get_f
>>>>>>> 6ae975c... Revise integrators.
using GeometricIntegrators.TestProblems.LotkaVolterra2dProblem: Δt

int = get_config(:ig_interpolation)

<<<<<<< HEAD
const Δt = 0.01
const q₀ = [1.0, 1.0]
const parameters = (a₁=1.0, a₂=1.0, b₁=-1.0, b₂=-2.0)

ode  = lotka_volterra_2d_ode(q₀; params=parameters)
pode = lotka_volterra_2d_pode(q₀; params=parameters)
iode = lotka_volterra_2d_iode(q₀; params=parameters)
vode = lotka_volterra_2d_vode(q₀; params=parameters)
=======
ode  = lotka_volterra_2d_ode()
dae  = lotka_volterra_2d_dae()

hode = lotka_volterra_2d_hode()
iode = lotka_volterra_2d_iode()
pode = lotka_volterra_2d_pode()
vode = lotka_volterra_2d_vode()

hdae = lotka_volterra_2d_hdae()
idae = lotka_volterra_2d_idae()
pdae = lotka_volterra_2d_pdae()
vdae = lotka_volterra_2d_vdae()
>>>>>>> 6ae975c... Revise integrators.

pdae = lotka_volterra_2d_pdae(q₀; params=parameters)
idae = lotka_volterra_2d_idae(q₀; params=parameters)
vdae = lotka_volterra_2d_vdae(q₀; params=parameters)

<<<<<<< HEAD

@test InitialGuessODE(int,  ode, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v̄( ode), Δt)
@test InitialGuessODE(int, iode, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v̄(iode), Δt)
@test InitialGuessODE(int, vode, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v̄(vode), Δt)

@test InitialGuess(int, ode, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v̄(ode), Δt)
@test InitialGuess(int, dae, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v̄(dae), Δt)

@test InitialGuess(int, hode, Δt) == InitialGuessPODE(int(0.0, 1.0, Δt), _get_v̄(hode), _get_f̄(hode), Δt)
@test InitialGuess(int, hdae, Δt) == InitialGuessPODE(int(0.0, 1.0, Δt), _get_v̄(hdae), _get_f̄(hdae), Δt)

@test InitialGuess(int, iode, Δt) == InitialGuessIODE(int(0.0, 1.0, Δt), _get_v̄(iode), _get_f̄(iode), Δt)
@test InitialGuess(int, idae, Δt) == InitialGuessIODE(int(0.0, 1.0, Δt), _get_v̄(idae), _get_f̄(idae), Δt)

@test InitialGuess(int, pode, Δt) == InitialGuessPODE(int(0.0, 1.0, Δt), _get_v̄(pode), _get_f̄(pode), Δt)
@test InitialGuess(int, pdae, Δt) == InitialGuessPODE(int(0.0, 1.0, Δt), _get_v̄(pdae), _get_f̄(pdae), Δt)

@test InitialGuess(int, vode, Δt) == InitialGuessIODE(int(0.0, 1.0, Δt), _get_v̄(vode), _get_f̄(vode), Δt)
@test InitialGuess(int, vdae, Δt) == InitialGuessIODE(int(0.0, 1.0, Δt), _get_v̄(vdae), _get_f̄(vdae), Δt)


# Reference Solution

ref_prev = integrate(ode, TableauGLRK(8), -Δt, 1)
ref_next = integrate(ode, TableauGLRK(8), +Δt, 1)

tₚ = ref_prev.t[end]
qₚ = ref_prev.q[end]
vₚ = zero(qₚ)

tₙ = ref_next.t[end]
qₙ = ref_next.q[end]
vₙ = zero(qₙ)

ode.v(tₚ, qₚ, vₚ, ode.parameters)
ode.v(tₙ, qₙ, vₙ, ode.parameters)


# InitialGuessODE

igode = InitialGuessODE(int, (t,q,v) -> ode.v(t, q, v, ode.parameters), Δt)

t₀ = ode.t₀
q₀ = ode.q₀[begin]
v₀ = zero(q₀)

t₁ = ode.t₀ - Δt
q₁ = zero(q₀)
v₁ = zero(v₀)

t₂ = one(Δt)
q₂ = zero(q₀)
v₂ = zero(v₀)

ode.v(t₀, q₀, v₀, ode.parameters)

initialize!(igode, t₀, q₀, v₀, t₁, q₁, v₁)
evaluate!(igode, q₁, v₁, q₀, v₀, q₂, v₂, t₂)

@test q₁ ≈ qₚ atol=1E-6
@test v₁ ≈ vₚ atol=1E-6

@test q₂ ≈ qₙ atol=1E-6
@test v₂ ≈ vₙ atol=1E-3


# InitialGuessIODE

igiode = InitialGuessIODE(int, (t,q,v) -> iode.v̄(t, q, v, iode.parameters), (t,q,p,v) -> iode.f̄(t, q, p, v, iode.parameters), Δt)

t₀ = iode.t₀
q₀ = iode.q₀[begin]
p₀ = iode.p₀[begin]
v₀ = zero(q₀)
f₀ = zero(p₀)

t₁ = iode.t₀ - Δt
q₁ = zero(q₀)
p₁ = zero(p₀)
v₁ = zero(v₀)
f₁ = zero(f₀)

t₂ = one(Δt)
q₂ = zero(q₀)
p₂ = zero(p₀)
v₂ = zero(v₀)
f₂ = zero(f₀)

iode.v̄(t₀, q₀, v₀, iode.parameters)

initialize!(igiode, t₀, q₀, p₀, v₀, f₀, t₁, q₁, p₁, v₁, f₁)
evaluate!(igiode, q₁, p₁, v₁, f₁, q₀, p₀, v₀, f₀, q₂, v₂, t₂)

@test q₁ ≈ qₚ atol=1E-6
@test v₁ ≈ vₚ atol=1E-6

@test q₂ ≈ qₙ atol=1E-6
@test v₂ ≈ vₙ atol=1E-3


# InitialGuessPODE

igpode = InitialGuessPODE(int,
            (t,q,p,v) -> pode.v(t, q, p, v, pode.parameters),
            (t,q,p,v) -> pode.f(t, q, p, v, pode.parameters), Δt)

t₀ = pode.t₀
q₀ = pode.q₀[begin]
p₀ = pode.p₀[begin]
v₀ = zero(q₀)
f₀ = zero(p₀)

t₁ = pode.t₀ - Δt
q₁ = zero(q₀)
p₁ = zero(p₀)
v₁ = zero(v₀)
f₁ = zero(f₀)

t₂ = one(Δt)
q₂ = zero(q₀)
p₂ = zero(p₀)
v₂ = zero(v₀)
f₂ = zero(f₀)

pode.v(t₀, q₀, p₀, v₀, pode.parameters)
pode.f(t₀, q₀, p₀, f₀, pode.parameters)

initialize!(igpode, t₀, q₀, p₀, v₀, f₀, t₁, q₁, p₁, v₁, f₁)
evaluate!(igpode, q₁, p₁, v₁, f₁, q₀, p₀, v₀, f₀, q₂, v₂, t₂)

@test q₁ ≈ qₚ atol=1E-6
@test v₁ ≈ vₚ atol=1E-6

@test q₂ ≈ qₙ atol=1E-6
@test v₂ ≈ vₙ atol=1E-3
=======
@test InitialGuessODE(int, iode, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v(iode), Δt)
@test InitialGuessODE(int, vode, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v(vode), Δt)

@test InitialGuess(int, ode, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v(ode), Δt)
@test InitialGuess(int, dae, Δt) == InitialGuessODE(int(0.0, 1.0, Δt), _get_v(dae), Δt)

@test InitialGuess(int, hode, Δt) == InitialGuessPODE(int(0.0, 1.0, Δt), _get_v(hode), _get_f(hode), Δt)
@test InitialGuess(int, hdae, Δt) == InitialGuessPODE(int(0.0, 1.0, Δt), _get_v(hdae), _get_f(hdae), Δt)

@test InitialGuess(int, iode, Δt) == InitialGuessIODE(int(0.0, 1.0, Δt), _get_v(iode), _get_f(iode), Δt)
@test InitialGuess(int, idae, Δt) == InitialGuessIODE(int(0.0, 1.0, Δt), _get_v(idae), _get_f(idae), Δt)

@test InitialGuess(int, pode, Δt) == InitialGuessPODE(int(0.0, 1.0, Δt), _get_v(pode), _get_f(pode), Δt)
@test InitialGuess(int, pdae, Δt) == InitialGuessPODE(int(0.0, 1.0, Δt), _get_v(pdae), _get_f(pdae), Δt)

@test InitialGuess(int, vode, Δt) == InitialGuessIODE(int(0.0, 1.0, Δt), _get_v(vode), _get_f(vode), Δt)
@test InitialGuess(int, vdae, Δt) == InitialGuessIODE(int(0.0, 1.0, Δt), _get_v(vdae), _get_f(vdae), Δt)
>>>>>>> 6ae975c... Revise integrators.