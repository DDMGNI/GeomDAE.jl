
function getTableauHPARK(name, q::CoefficientsRK{T}, p::CoefficientsRK{T}, d=[]) where {T}

    @assert q.s == p.s

    o = min(q.o, p.o)

    a_q = q.a
    a_p = p.a
    b_q = q.b
    b_p = p.b
    c_q = q.c
    c_p = p.c


    if length(d) == 0
        return TableauHPARK(name, o,
                            a_q, a_p, a_q, a_p,
                            a_q, a_p, a_q, a_p,
                            b_q, b_p, b_q, b_p,
                            c_q, c_p, c_q, c_p)
    else
        @assert length(d) == q.s == p.s

        return TableauHPARK(name, o,
                            a_q, a_p, a_q, a_p,
                            a_q, a_p, a_q, a_p,
                            b_q, b_p, b_q, b_p,
                            c_q, c_p, c_q, c_p,
                            d)
    end
end


"SPARK tableau for Gauss-Lobatto IIIA-IIIB HPARK method with s stages."
function TableauHPARKLobIIIAIIIB(s)
    getTableauHPARK(Symbol("HPARKLobIIIAIIIB($s)"), getCoefficientsLobIIIA(s), getCoefficientsLobIIIB(s))
end

"SPARK tableau for Gauss-Lobatto IIIB-IIIA  method with s stages."
function TableauHPARKLobIIIBIIIA(s)
    getTableauHPARK(Symbol("HPARKLobIIIBIIIA($s)"), getCoefficientsLobIIIB(s), getCoefficientsLobIIIA(s))
end

"Tableau for Gauss-Legendre HPARK method with s stages."
function TableauHPARKGLRK(s)
    glrk = getCoefficientsGLRK(s)
    getTableauHPARK(Symbol("HPARKGLRK", s), glrk, glrk)
end
